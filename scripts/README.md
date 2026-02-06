Project import helpers
----------------------

This folder contains helper scripts to convert the repository's `schema/` backups into SQL you can paste into Supabase and to extract storage objects.

Scripts

- `generate-sql.sh` - Requires `pg_restore` (Postgres client tools). It will:
  - find the first `*.backup` file in `SCHEMA_FOLDER` (falls back to `./schema`)
  - generate `out/schema.sql` (schema-only)
  - generate `out/data.sql` (data-only)
  - generate `out/supabase_import.sql` (schema followed by a wrapped data section)

  Usage (from repo root):

  ```bash
  # ensure SCHEMA_FOLDER is set (we add it to .env as SCHEMA_FOLDER=./schema)
  ./scripts/generate-sql.sh
  # results in out/supabase_import.sql
  ```

- `unpack-storage.sh` - extracts `*.storage.zip` archives found in `SCHEMA_FOLDER` into `out/storage/`.

- `import-to-db.sh` - use this to run `out/supabase_import.sql` against a Postgres database (recommended for correct ordering and constraints). Set the connection string in `PG_CONN`.

  Usage:

  ```bash
  export PG_CONN="postgres://<user>:<password>@<host>:5432/<db>"
  ./scripts/import-to-db.sh
  ```

Notes and caveats
- The scripts depend on `pg_restore` to read the Postgres custom-format backup (`*.backup`). If you don't have the Postgres client tools installed, install them (e.g., `brew install libpq` on macOS and `brew link --force libpq` or use `apt-get install postgresql-client` on Linux).
- Supabase's SQL editor may disallow session and role changes (like `SET session_replication_role = replica`). If the combined import fails due to FK constraints, import schema first, then data using a managed database restore (pg_restore against a Postgres instance) or use the `supabase` CLI / direct DB connection.
- I did not create a data re-insertion Node script because the `.backup` is in PostgreSQL's custom format; the safest way to restore data is via `pg_restore`. If you prefer, I can add a Node-based importer that reads CSV/JSON exports instead.
