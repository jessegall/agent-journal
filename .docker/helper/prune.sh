#!/bin/sh
# Cleans up after an image build: removes what no later build or running container can use and keeps the cache the
# next build reuses. JOURNAL_BUILD_CACHE_DAYS (2) and JOURNAL_BUILD_CACHE_SIZE (3GB) change the two limits.
set -eu

main() {
    days="${JOURNAL_BUILD_CACHE_DAYS:-2}"
    size="${JOURNAL_BUILD_CACHE_SIZE:-3GB}"
    remove_untagged_images
    remove_unused_project_images
    remove_old_build_cache
    cap_build_cache
    docker system df
}

# Rebuilding a tag leaves its earlier image untagged; one a container still uses is never removed.
remove_untagged_images() {
    docker image prune --force >/dev/null
}

# Images a service of an earlier version left behind, which no container uses any more.
remove_unused_project_images() {
    local project used_images image
    project=$(project_name)
    used_images=$(docker ps --all --format '{{.Image}}')
    for image in $(docker image ls --format '{{.Repository}}:{{.Tag}}' | grep "^$project-"); do
        if ! printf '%s\n' "$used_images" | grep -qx -e "$image" -e "${image%:latest}"; then
            docker image rm "$image" >/dev/null
        fi
    done
}

project_name() {
    local configured
    configured="${COMPOSE_PROJECT_NAME:-$(sed -n 's/^COMPOSE_PROJECT_NAME=//p' .env 2>/dev/null | tail -n 1)}"
    echo "${configured:-$(basename "$PWD")}"
}

remove_old_build_cache() {
    docker builder prune --force --filter "until=$((days * 24))h" >/dev/null
}

# The option that caps the cache was renamed between Docker versions.
cap_build_cache() {
    if docker builder prune --help 2>/dev/null | grep -q -- '--max-used-space'; then
        docker builder prune --force --max-used-space "$size" >/dev/null
    else
        docker builder prune --force --keep-storage "$size" >/dev/null
    fi
}

main "$@"
