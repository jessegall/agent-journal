#!/usr/bin/env sh
# Creates the dedicated Postgres test databases in the compose postgres service, once each: journal_hooks_test for the
# agents' own runs and journal_hooks_test_checkpoint for the journal's checkpoint runs, so the two never share worker
# databases. It reads the user from the container's own POSTGRES_USER, so no credential is printed or passed here.
set -eu

for database in journal_hooks_test journal_hooks_test_checkpoint; do
    exists=$(docker compose exec -T postgres sh -c "psql -U \"\$POSTGRES_USER\" -d postgres -tAc \"SELECT 1 FROM pg_database WHERE datname = '${database}'\"")

    if [ "$exists" = "1" ]; then
        echo "The test database ${database} already exists."
        continue
    fi

    docker compose exec -T postgres sh -c "createdb -U \"\$POSTGRES_USER\" ${database}"
    echo "The test database ${database} was created."
done
