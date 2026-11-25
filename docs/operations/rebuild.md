# Rebuilding a development database

## Why the schema changed

Every record now belongs to a project. The create migrations themselves hold the owner columns (a `project_id` on
agents, environments made before every table that names them), so the schema of version 6 is only ever made from
the create migrations. No migration converts old rows.

## What happens to existing rows

`php artisan migrate:fresh` drops every table and makes them again from the create migrations. Every development
row is discarded: tasks, plans, messages, agents, sessions and grants. Nothing is converted or carried over. If you
want to keep what you have, take a snapshot first (below); the rebuilt database never reads it.

## Rebuild, in this order

1. Stop the journal's services, and keep the database running for the snapshot:

   ```sh
   docker compose stop updater app web reverb queue scheduler ticker share agent-host accounts
   ```

   The updater goes first, so it does not start the others again while you rebuild.

2. Keep a snapshot of the old rows, if you want them later:

   ```sh
   docker compose exec -T postgres pg_dump -U journal journal > journal-before-rebuild.sql
   ```

   It is a plain SQL file. To look at the old rows again, load it into a separate database, never the rebuilt one.

3. Make the new schema and seed it:

   ```sh
   docker compose run --rm -T app php artisan migrate:fresh --seed --force
   ```

   The seed makes the owner, the installation's own project with its Main environment and the owner's grants on it,
   and the sample records.

4. On an installation without the sample seed, make the local project yourself, after the owner exists:

   ```sh
   docker compose run --rm -T app php artisan projects:local-provision
   ```

   It makes nothing twice, so running it after a seeded rebuild changes nothing. With `JOURNAL_LOCAL_EXECUTION=false`
   it makes no project at all.

5. Start the journal again:

   ```sh
   docker compose up -d
   ```
