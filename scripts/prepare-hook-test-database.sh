#!/usr/bin/env sh
# Creates the Postgres test databases of the agents' runs and of the journal's checkpoint runs, once each, as the
# postgres service's own user, so no credential is passed here.   sh scripts/prepare-hook-test-database.sh
set -eu

main() {
    local database
    for database in journal_hooks_test journal_hooks_test_checkpoint; do
        create_database "$database"
    done
}

create_database() {
    if [ "$(has_database "$1")" = "1" ]; then
        echo "The test database $1 already exists."
        return
    fi
    docker compose exec -T postgres sh -c "createdb -U \"\$POSTGRES_USER\" $1"
    echo "The test database $1 was created."
}

has_database() {
    docker compose exec -T postgres sh -c \
        "psql -U \"\$POSTGRES_USER\" -d postgres -tAc \"SELECT 1 FROM pg_database WHERE datname = '$1'\""
}

main "$@"
