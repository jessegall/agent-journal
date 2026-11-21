#!/bin/sh
# Builds one of the journal's images for one architecture, the agent image (the default) or the runner image, and
# records it by digest and name in docs/accounts/docker-images.json. The record is written verified only after the
# build checks pass: no secret in any layer, the pinned clients answer their versions, and for the agent image
# journal-check, journal-init and journal-exec are installed read-only, the executor's user shares the workspace group,
# bwrap and socat answer, no Docker, journal-agent or console is in it and it runs as 10001:10001.
set -eu

architecture="${1:?name the architecture, such as linux/arm64}"
name="${2:-agent}"

case "$name" in
    agent) dockerfile=.docker/helper/Dockerfile; target=agent ;;
    runner) dockerfile=.docker/app/Dockerfile; target=runner ;;
    *) echo "Name the image agent or runner, not $name." >&2; exit 2 ;;
esac

tag="journal-$name:build"

# The pinned client versions are passed to both images from here, so they are named in one place.
claude_code=2.1.323
codex=0.165.0
target_option=""
if [ "$target" = runner ]; then target_option="--target runner"; fi

# shellcheck disable=SC2086
docker buildx build --platform "$architecture" --file "$dockerfile" $target_option \
    --build-arg "CLAUDE_CODE_VERSION=$claude_code" --build-arg "CODEX_VERSION=$codex" --tag "$tag" --load .

docker run --rm --entrypoint claude "$tag" --version | grep -q "$claude_code"
docker run --rm --entrypoint codex "$tag" --version | grep -q "$codex"

if [ "$name" = agent ]; then
    docker run --rm --entrypoint id "$tag" -u | grep -qx 10001
    docker run --rm --entrypoint test "$tag" -x /opt/journal/bin/journal-check
    for protected in journal-init journal-exec; do
        docker run --rm --entrypoint stat "$tag" -c '%U:%G %a' "/opt/journal/bin/$protected" | grep -qx 'root:root 555'
    done
    docker run --rm --entrypoint id "$tag" journal-tools | grep -q 'uid=10002(journal-tools).*10010(journal-work)'
    docker run --rm --entrypoint stat "$tag" -c '%u:%g %a' /workspace | grep -qx '10001:10010 2770'
    docker run --rm --entrypoint bwrap "$tag" --version >/dev/null
    docker run --rm --entrypoint socat "$tag" -V >/dev/null
    for absent in docker journal-agent; do
        if docker run --rm --entrypoint sh "$tag" -c "command -v $absent" >/dev/null 2>&1; then
            echo "The agent image holds $absent: it is refused." >&2
            exit 1
        fi
    done
    console_search="find / -name artisan -not -path '/proc/*' 2>/dev/null | grep -q ."
    if docker run --rm --entrypoint sh "$tag" -c "$console_search"; then
        echo "The agent image holds the journal's console: it is refused." >&2
        exit 1
    fi
fi

if [ "$name" = runner ]; then
    docker run --rm --entrypoint id "$tag" -u | grep -qx 10001
    docker run --rm --workdir /app --entrypoint php "$tag" artisan list >/dev/null
    docker run --rm --workdir /app --entrypoint php "$tag" artisan accounts:run-sign-ins --help >/dev/null
    docker run --rm --entrypoint sh "$tag" -c "journal-agent 2>&1 | grep -q 'usage: journal-agent'"
    if docker run --rm --entrypoint test "$tag" -e /app/.env; then
        echo "The runner image holds a .env: it is refused." >&2
        exit 1
    fi
fi

# A layer that sets a token, secret or password, or holds a sign-in file; a build flag that merely names a word, such
# as the base image's --with-password-argon2, is no credential.
if docker history --no-trunc "$tag" | grep -Eiq "(token|secret|password)[a-z_]*=|auth\.json|\.credentials\.json"; then
    echo "A layer mentions a credential: the image is refused." >&2
    exit 1
fi

# The agent daemon has no registry: the image reaches it as a saved file, and it is pinned by its config digest,
# the image id a loaded image keeps (a repository digest does not survive a load).
mkdir -p images
archive="images/$name-$(echo "$architecture" | tr / -).tar"
docker save -o "$archive" "$tag"
# The rootless agent daemon loads it as its own user; an image holds no secret (checked above).
chmod 0644 "$archive"
# PHP runs in a container, so the build needs no PHP on the machine it runs on, such as the server itself, where an
# image builds natively instead of under emulation.
php() {
    docker run --rm -i --volume "$PWD/docs/accounts:/accounts" --workdir / composer:2 php "$@"
}
config="$(tar -xOf "$archive" manifest.json | php -r 'echo json_decode(stream_get_contents(STDIN), true)[0]["Config"];')"
digest="sha256:$(basename "$config" .json)"
php -r '
    $path = "/accounts/docker-images.json";
    $record = json_decode(file_get_contents($path), true);
    $record["images"][] = [
        "name" => $argv[3], "architecture" => $argv[1], "reference" => $argv[2],
        "claude_code" => $argv[4], "codex" => $argv[5], "built_at" => gmdate("c"),
    ];
    file_put_contents($path, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).PHP_EOL);
' "$architecture" "$digest" "$name" "$claude_code" "$codex"
