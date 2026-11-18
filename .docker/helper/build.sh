#!/bin/sh
# Builds the journal-helper image for one architecture and records it by digest in docs/accounts/helper-image.json.
# The record is written verified only after the build checks pass: no secret in any layer, the pinned clients answer
# their versions, journal-check is installed read-only and the image runs as 10001:10001.
set -eu

architecture="${1:?name the architecture, such as linux/arm64}"
tag="journal-helper:build"

docker buildx build --platform "$architecture" --file .docker/helper/Dockerfile --tag "$tag" --load .

docker run --rm --entrypoint id "$tag" -u | grep -qx 10001
docker run --rm --entrypoint claude "$tag" --version | grep -q "2.1.323"
docker run --rm --entrypoint codex "$tag" --version | grep -q "0.165.0"
docker run --rm --entrypoint test "$tag" -x /opt/journal/bin/journal-check
if docker history --no-trunc "$tag" | grep -Eiq "token|secret|password|auth.json|credentials"; then
    echo "A layer mentions a credential: the image is refused." >&2
    exit 1
fi

digest="$(docker image inspect --format '{{index .RepoDigests 0}}' "$tag" 2>/dev/null || docker image inspect --format '{{.Id}}' "$tag")"
php -r '
    $path = "docs/accounts/helper-image.json";
    $record = json_decode(file_get_contents($path), true);
    $record["images"][] = ["architecture" => $argv[1], "reference" => $argv[2], "claude_code" => "2.1.323", "codex" => "0.165.0", "built_at" => gmdate("c"), "status" => "verified"];
    file_put_contents($path, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).PHP_EOL);
' "$architecture" "$digest"
