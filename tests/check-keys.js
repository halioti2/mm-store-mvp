#!/usr/bin/env node
// Lightweight key/credential smoke checks for local development
// - Uses dotenv to load local .env
// - Makes small HTTP requests where possible to validate keys

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SPOONACULAR = process.env.SPOONACULAR_API_KEY;
const GCP_JSON = process.env.GCP_SERVICE_ACCOUNT_JSON;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST = process.env.YOUTUBE_PLAYLIST_ID;

function ok(msg) { console.log('\x1b[32m[OK]\x1b[0m ' + msg); }
function warn(msg) { console.log('\x1b[33m[WARN]\x1b[0m ' + msg); }
function fail(msg) { console.log('\x1b[31m[FAIL]\x1b[0m ' + msg); }

async function checkSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    fail('Supabase URL or anon key missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
    return;
  }

  try {
    const url = new URL('/rest/v1/', SUPABASE_URL).toString();
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`
      },
      // short timeout not available in node-fetch v3 nicely; rely on network
    });

    if (res.status === 401 || res.status === 403) {
      fail(`Supabase anon key appears invalid (status ${res.status})`);
    } else {
      ok(`Supabase anon key appears accepted (endpoint /rest/v1 returned ${res.status})`);
    }
  } catch (err) {
    fail('Supabase check failed: ' + err.message);
  }

  if (SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const url = new URL('/rest/v1/', SUPABASE_URL).toString();
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      });
      if (res.status === 401 || res.status === 403) {
        fail(`Supabase service-role key appears invalid (status ${res.status})`);
      } else {
        ok(`Supabase service-role key appears accepted (endpoint /rest/v1 returned ${res.status})`);
      }
    } catch (err) {
      fail('Supabase service-role check failed: ' + err.message);
    }
  } else {
    warn('Supabase service-role key not set (SUPABASE_SERVICE_ROLE_KEY)');
  }
}

async function checkSpoonacular() {
  if (!SPOONACULAR) { warn('Spoonacular key not set (SPOONACULAR_API_KEY)'); return; }
  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=1&apiKey=${SPOONACULAR}`;
    const res = await fetch(url);
    if (res.status === 200) {
      ok('Spoonacular API key accepted (200)');
    } else {
      const body = await res.text();
      fail(`Spoonacular returned ${res.status}: ${body.substring(0,200)}`);
    }
  } catch (err) {
    fail('Spoonacular check failed: ' + err.message);
  }
}

async function checkYouTube() {
  if (!YOUTUBE_KEY) { warn('YouTube API key not set (YOUTUBE_API_KEY)'); return; }
  if (!YOUTUBE_PLAYLIST) { warn('YouTube playlist id not set (YOUTUBE_PLAYLIST_ID)'); }

  try {
    // If playlist ID provided, check it. Otherwise check a simple endpoint.
    const endpoint = YOUTUBE_PLAYLIST
      ? `https://www.googleapis.com/youtube/v3/playlists?part=id&id=${YOUTUBE_PLAYLIST}&key=${YOUTUBE_KEY}`
      : `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=GoogleDevelopers&key=${YOUTUBE_KEY}`;

    const res = await fetch(endpoint);
    const json = await res.json().catch(() => null);
    if (res.status === 200) {
      // If playlist check, ensure API responded without auth error. If items empty, playlist may not exist.
      ok(`YouTube API key accepted (status 200). Response items: ${Array.isArray(json?.items) ? json.items.length : 'unknown'}`);
    } else {
      fail(`YouTube returned ${res.status}: ${JSON.stringify(json)?.substring(0,200)}`);
    }
  } catch (err) {
    fail('YouTube check failed: ' + err.message);
  }
}

function checkGCP() {
  if (!GCP_JSON) { warn('GCP service account JSON not set (GCP_SERVICE_ACCOUNT_JSON)'); return; }
  // Try to parse the JSON. If it fails, attempt a few tolerant fixes (strip NBSPs, escape literal newlines)
  try {
    var parsed;
    try {
      parsed = JSON.parse(GCP_JSON);
    } catch (e) {
      // Common problems: pasted JSON contains literal newlines (invalid JSON) or non-breaking spaces
      const cleaned = GCP_JSON.replace(/\u00A0/g, ' ').replace(/\r?\n/g, '\\n');
      parsed = JSON.parse(cleaned);
    }
    if (parsed.private_key && parsed.client_email) {
      if (GCP_PROJECT_ID && parsed.project_id && parsed.project_id !== GCP_PROJECT_ID) {
        warn('GCP_PROJECT_ID does not match project_id in GCP_SERVICE_ACCOUNT_JSON');
      }
      if (!parsed.private_key.startsWith('-----BEGIN')) {
        warn("GCP private_key doesn't look like a PEM key");
      }
      ok('GCP service account JSON parsed and looks valid (basic check)');
    } else {
      fail('GCP JSON parsed but missing private_key or client_email');
    }
  } catch (err) {
    fail('Failed to parse GCP service account JSON: ' + err.message);
  }
}

async function main() {
  console.log('Running lightweight API key checks (non-destructive).\n');

  await checkSupabase();
  console.log('');
  await checkSpoonacular();
  console.log('');
  await checkYouTube();
  console.log('');
  checkGCP();

  console.log('\nFinished checks. Note: these are lightweight smoke checks that validate presence and basic acceptance by endpoints.');
}

main().catch((err) => { console.error(err); process.exit(1); });
