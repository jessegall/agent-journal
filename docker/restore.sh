#!/bin/sh
# Puts a restic snapshot back into the journal's volume: ./restore.sh [snapshot id, latest by default].
# The journal is stopped first and started again after, so nothing writes while the files are replaced.
set -eu
cd "$(dirname "$0")"
docker compose --profile journal stop journal
SNAPSHOT="${1:-latest}" docker compose run --rm --no-deps restore
docker compose --profile journal start journal
