#!/bin/sh
# Loads the two pinned images into the agent daemon from images/ when one is missing, and keeps only the pinned images
# and those a container still runs on.   sh /load.sh   (in the agent-images service, with AGENT_IMAGE and RUNNER_IMAGE)
set -eu

main() {
    local archives=${AGENT_IMAGE_ARCHIVES:-/images}
    if [ -z "$AGENT_IMAGE" ] || [ -z "$RUNNER_IMAGE" ]; then
        echo "Name AGENT_IMAGE and RUNNER_IMAGE by image id in .env." >&2
        exit 1
    fi
    remove_unheld_images
    load_missing_images "$archives"
    check_loaded_images
}

# An earlier build never fills the disk, and an agent at work keeps its image until its container is gone.
remove_unheld_images() {
    local held
    for held in $(docker image ls --quiet --no-trunc); do
        [ "$held" = "$AGENT_IMAGE" ] || [ "$held" = "$RUNNER_IMAGE" ] && continue
        [ -n "$(docker container ls --all --quiet --filter "ancestor=$held")" ] && continue
        docker image rm --force "$held" >/dev/null
    done
    docker image prune --force >/dev/null
}

load_missing_images() {
    local archive
    docker image inspect "$AGENT_IMAGE" "$RUNNER_IMAGE" >/dev/null 2>&1 && return 0
    for archive in "$1"/*.tar; do
        docker load --quiet --input "$archive"
    done
}

check_loaded_images() {
    local image loaded
    for image in "$AGENT_IMAGE" "$RUNNER_IMAGE"; do
        loaded="$(docker image inspect --format '{{.Id}}' "$image" 2>/dev/null || true)"
        if [ "$loaded" != "$image" ]; then
            echo "The agent daemon holds no image $image: build it and copy images/ here." >&2
            exit 1
        fi
    done
}

main "$@"
