#!/bin/sh
# Cleans up after an image build, on any machine that builds the journal's images. It removes what no later build or
# running container can use and keeps the cache a next build reuses:
# - images no tag names any more: rebuilding a tag leaves its earlier image untagged, so only the newest of each
#   build stays (an image a container still uses is never removed);
# - build cache unused for a week, then the least recently used cache past a size cap.
# JOURNAL_BUILD_CACHE_DAYS (7) and JOURNAL_BUILD_CACHE_SIZE (10GB) change the two limits.
set -eu

days="${JOURNAL_BUILD_CACHE_DAYS:-7}"
size="${JOURNAL_BUILD_CACHE_SIZE:-10GB}"

docker image prune --force >/dev/null
docker builder prune --force --filter "until=$((days * 24))h" >/dev/null

# Docker 28 names the size cap --max-used-space; an older client calls it --keep-storage.
if docker builder prune --help 2>/dev/null | grep -q -- '--max-used-space'; then
    docker builder prune --force --max-used-space "$size" >/dev/null
else
    docker builder prune --force --keep-storage "$size" >/dev/null
fi

docker system df
