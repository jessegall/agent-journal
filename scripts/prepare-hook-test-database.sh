#!/usr/bin/env sh
# Creates the dedicated Postgres database journal_hooks_test in the compose postgres service, once.
# It reads the user from the container's own POSTGRES_USER, so no credential is printed or passed here.
set -eu

database=journal_hooks_test

exists=$(docker compose exec -T postgres sh -c "psql -U \"\$POSTGRES_USER\" -d postgres -tAc \"SELECT 1 FROM pg_database WHERE datname = '${database}'\"")

if [ "$exists" = "1" ]; then
    echo "The test database ${database} already exists."
    exit 0
fi

docker compose exec -T postgres sh -c "createdb -U \"\$POSTGRES_USER\" ${database}"
echo "The test database ${database} was created."
