#!/bin/sh
# Brings an installation up to the newest commit of its branch. The updater service fetches this script from the
# repository every minute and runs it in the installation's folder, so a change to it reaches every installation.
# When the branch has a commit newer than the installed one, it writes that commit's files into the folder (never a
# checkout there), removes the files the commit deleted, rebuilds, restarts, migrates, activates the built-in profiles
# and records the commit. A commit that fails is recorded too and not tried again; the next push is.
#
# It reads, from the environment the updater service passes on:
#   JOURNAL_ROOT       the installation's folder, the same path inside the updater as on the server
#   JOURNAL_BRANCH     the branch to follow (version-6)
#   JOURNAL_REPOSITORY the repository to follow (the public journal repository)
set -eu

root=${JOURNAL_ROOT:?the updater names the installation folder}
branch=${JOURNAL_BRANCH:?the updater names the branch}
repository=${JOURNAL_REPOSITORY:?the updater names the repository}
# Where the updater keeps its own files, and the loop it runs: fixed on a server, named by a test.
state=${JOURNAL_UPDATER_STATE:-/var/lib/journal-updater}
running_loop=${JOURNAL_UPDATER_LOOP:-/usr/local/bin/journal-updater}
mirror=$state/mirror.git
cd "$root"

newest=$(git ls-remote "$repository" "refs/heads/$branch" | cut -f1)
[ -n "$newest" ] || { echo "$(date -u +%FT%TZ) the branch $branch is not in $repository"; exit 1; }
installed=$(cat .installed-commit 2>/dev/null || true)
failed=$(cat .failed-commit 2>/dev/null || true)
[ "$newest" = "$installed" ] || [ "$newest" = "$failed" ] && exit 0

echo "$(date -u +%FT%TZ) installing $branch $newest (installed: ${installed:-nothing})"
[ -d "$mirror" ] || git clone --quiet --bare "$repository" "$mirror"
git -C "$mirror" fetch --quiet --force "$repository" "refs/heads/$branch:refs/heads/$branch"

# The images this server built are recorded in docs/accounts/docker-images.json, which the commit's own copy replaces:
# the rows it lacks are kept, so an image built and checked here stays verified across installs.
images="docs/accounts/docker-images.json"
built_here=$(cat "$images" 2>/dev/null || echo '{"images": []}')
git -C "$mirror" archive "$newest" | tar -x -C "$root"
printf '%s' "$built_here" | python3 -c '
import json, sys
path = sys.argv[1]
kept = json.load(sys.stdin)["images"]
record = json.load(open(path))
record["images"] += [row for row in kept if row not in record["images"]]
open(path, "w").write(json.dumps(record, indent=4) + "\n")
' "$images"
# The version the journal shows, baked into the build: the commit, its branch and its release tag, if it has one.
tag=$(git -C "$mirror" describe --tags --exact-match "$newest" 2>/dev/null || true)
printf '%s\n%s\n%s\n' "$newest" "$branch" "$tag" > .installed-version
if [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null; then
    git -C "$mirror" diff --no-renames --name-only --diff-filter=D "$installed" "$newest" | while read -r gone; do
        rm -f "$root/$gone"
    done
fi

# Migrations run only when the commits since the installed one add or change one; a first install always runs them.
migrations_changed=yes
if [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null &&
    ! git -C "$mirror" diff --name-only "$installed" "$newest" | grep -qE '(^|/)(Database/Migrations|database/migrations)/'; then
    migrations_changed=no
fi

# Nothing is released, so a schema change edits its table's create migration in place instead of adding one. A
# migration the installed commit already had that changed or went away is rerun by no plain migrate, so the database
# is rebuilt from the migrations instead: the test server's data is wiped by design (question 36).
schema_rebuilt=no
if [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null &&
    git -C "$mirror" diff --name-only --diff-filter=MDR "$installed" "$newest" |
    grep -qE '(^|/)(Database/Migrations|database/migrations)/'; then
    schema_rebuilt=yes
fi

# A contained installation, as its .env says, also runs the contained profile and its pinned runner image.
arrangement=$(sed -n 's/^AGENTS_ARRANGEMENT=//p' .env | tail -n 1)
profiles=""
[ "$arrangement" = contained ] && profiles="--profile contained"

# Each step must pass for the commit to count as installed: set -e does not hold inside an if, so they are chained.
# The prune runs first as well as last, so a failed install that filled the disk does not starve the next build.
# Migrations run on the new image before the switch, so they must leave the old code working.
install() {
    sh .docker/helper/prune.sh >/dev/null &&
        docker compose --progress=quiet build app share web &&
        { [ "$arrangement" != contained ] || pin_runner; } &&
        { [ "$arrangement" != contained ] || pin_agent; } &&
        { [ "$migrations_changed" = no ] || [ "$schema_rebuilt" = yes ] ||
            docker compose run --rm -T app php artisan migrate --force; } &&
        { [ "$schema_rebuilt" = no ] || docker compose run --rm -T app php artisan migrate:fresh --force; } &&
        docker compose run --rm -T app php artisan access:owner-ensure &&
        enroll_rebuilt_host &&
        publish_release &&
        roll_app &&
        docker compose $profiles up -d --wait --wait-timeout 240 &&
        restart_changed_mounts &&
        docker compose exec -T app php artisan agents:install &&
        activate_profiles &&
        docker compose exec -T app php artisan cache:forget installed-version &&
        check_front_door &&
        sh .docker/helper/prune.sh >/dev/null
}

# A rebuilt database has forgotten the contained host, whose saved id and secret the journal then refuses, so the
# host is enrolled again and its new id and secret replace the old ones where compose and agent-host-enroll read them.
enroll_rebuilt_host() {
    [ "$arrangement" = contained ] && [ "$schema_rebuilt" = yes ] || return 0
    name=$(sed -n 's/^AGENTS_INSTALLATION_NAME=//p' .env | tail -n 1)
    enrolled=$(docker compose run --rm -T app php artisan agents:host-enroll "${name:-journal}" --contained --root /workspace) || return 1
    host_id=$(printf '%s\n' "$enrolled" | sed -n 's/^Host \([0-9a-z]*\) is enrolled.*/\1/p')
    secret=$(printf '%s\n' "$enrolled" | tail -n 1 | tr -d '\r')
    [ -n "$host_id" ] && [ -n "$secret" ] || { echo "the rebuilt host's enrolment printed no id or secret"; return 1; }
    sed -i "s/^AGENTS_HOST_ID=.*/AGENTS_HOST_ID=$host_id/" .env
    (umask 077 && printf '%s\n' "$secret" > secrets/journal_host_secret) && chown 10001:10001 secrets/journal_host_secret
}

# Every install publishes a signed release of the journal-agent host built from the commit, so install lines hand out
# the host that speaks this commit's protocol. It is built in a Go container from a clone of the mirror and signed with
# the ed25519 key the operator put at release.key on the updater volume, outside any checkout; it lands in the releases
# volume the app reads, named by the commit's first twelve characters, which .env then names as JOURNAL_RELEASE. The
# three newest releases are kept, so a line issued just before an install still downloads.
publish_release() {
    version=$(printf '%.12s' "$newest")
    key=$state/release.key
    source=$state/release-source
    [ -f "$key" ] || { echo "no release signing key at $key on the updater volume: put the ed25519 key there"; return 1; }
    project=$(docker compose config --format json | python3 -c 'import json, sys; print(json.load(sys.stdin)["name"])')
    rm -rf "$source" &&
        git clone --quiet --shared "$mirror" "$source" &&
        git -C "$source" checkout --quiet "$newest" &&
        docker run --rm \
            -v "${project}_updater-mirror:$state" \
            -v "${project}_releases:/releases" \
            -v journal-release-go-cache:/root/.cache \
            -v journal-release-go-modules:/go/pkg/mod \
            -w "$source/tools/journal-agent" golang:1.26.4-bookworm sh -c "
                git config --global --add safe.directory '*' &&
                { [ -d /releases/$version ] || go run ./cmd/journal-release --version $version --signing-key $key --out /releases/$version --module .; } &&
                ls -1t /releases | tail -n +4 | sed 's|^|/releases/|' | xargs -r rm -rf" &&
        rm -rf "$source" &&
        sed -i '/^JOURNAL_RELEASE=/d' .env &&
        printf 'JOURNAL_RELEASE=%s\n' "$version" >> .env
}

# A service reads a file mounted from the installation folder only when it starts, and compose sees no change in it,
# so every running service with a mounted file the installed commits changed is restarted.
restart_changed_mounts() {
    [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null || return 0
    git -C "$mirror" diff --name-only "$installed" "$newest" > "$state/changed-files"
    services=$(docker compose $profiles config --format json | python3 -c '
import json, os, sys
root = os.path.realpath(sys.argv[1])
changed = set(open(sys.argv[2]).read().split())
for name, service in json.load(sys.stdin)["services"].items():
    for volume in service.get("volumes", []):
        source = os.path.realpath(volume.get("source", ""))
        if volume.get("type") == "bind" and source.startswith(root + "/"):
            mounted = os.path.relpath(source, root)
            if any(path == mounted or path.startswith(mounted + "/") for path in changed):
                print(name)
                break
' "$root" "$state/changed-files")
    [ -z "$services" ] || docker compose $profiles restart $services
}

# The installed journal must answer through its front door (the updater shares its network), and a page asked for over HTTPS must link its assets over
# HTTPS, as the server's own proxy asks for it; otherwise the install counts as failed.
check_front_door() {
    front=http://web:8000
    tries=0
    until curl -fsS -o /dev/null "$front/up"; do
        tries=$((tries + 1))
        [ "$tries" -lt 30 ] || { echo "the journal does not answer at $front/up"; return 1; }
        sleep 2
    done
    if curl -fsS -H 'X-Forwarded-Proto: https' "$front/login" | grep -q 'http://[^"]*/build/'; then
        echo "a page asked for over HTTPS links its assets over http"
        return 1
    fi
}

# Activates the shipped profiles; its output is shown only when it fails, so a failed install says why.
activate_profiles() {
    activated=$(docker compose exec -T app php artisan profile:activate 2>&1) || { printf '%s\n' "$activated"; return 1; }
}

# A rolling update of the app: the new container starts beside the old one, and the old one stops only once the new
# one is healthy. The web service in front passes requests to both meanwhile, so the journal keeps answering.
roll_app() {
    old=$(docker compose ps -q app)
    [ -n "$old" ] || return 0
    docker compose up -d --no-deps --no-recreate --scale app=2 app &&
        new=$(docker compose ps -q app | grep -v "$old") &&
        wait_healthy "$new" &&
        docker stop "$old" >/dev/null &&
        docker rm "$old" >/dev/null &&
        docker compose up -d --no-deps --no-recreate --scale app=1 app
}

wait_healthy() {
    tries=0
    until [ "$(docker inspect -f '{{.State.Health.Status}}' "$1")" = healthy ]; do
        tries=$((tries + 1))
        [ "$tries" -lt 120 ] || { echo "the new app container did not become healthy"; docker rm -f "$1" >/dev/null; return 1; }
        sleep 2
    done
}

pin_runner() {
    build_and_pin runner RUNNER_IMAGE
}

# Builds the agent image only when its own sources changed since the pinned one was built.
pin_agent() {
    agent_sources=$(agent_image_sources) || return 1
    [ "$(cat images/agent.source 2>/dev/null)" != "$agent_sources" ] || return 0
    build_and_pin agent AGENT_IMAGE &&
        printf '%s\n' "$agent_sources" > images/agent.source
}

# The folders that go into the agent image, as the commit holds them.
agent_image_sources() {
    git -C "$mirror" rev-parse "$newest:.docker/helper" "$newest:tools/journal-agent" "$newest:tools/journal-check"
}

# Builds one image for this server and writes its id into .env under the setting named.
build_and_pin() {
    platform=$(docker version --format '{{.Server.Os}}/{{.Server.Arch}}') &&
        sh .docker/helper/build.sh "$platform" "$1" &&
        built=$(python3 .docker/updater/newest-image-reference.py "$images") &&
        sed -i "s|^$2=.*|$2=$built|" .env
}

# The new updater is put in place by a short-lived container of its own image: compose run inside this container would
# stop this container, and itself with it, before the new one starts.
replace_updater() {
    docker compose --profile updater build updater &&
        image=$(docker compose --profile updater config --images updater) &&
        docker run -d --rm --entrypoint sh -v /var/run/docker.sock:/var/run/docker.sock -v "$root:$root" -w "$root" \
            "$image" -c 'sleep 2; docker compose --profile updater up -d --no-deps updater' >/dev/null
}

# The updater rebuilds itself, as the last step, when the loop it runs is not the installed commit's: the new container
# takes over from this one. Comparing the files, not the commits, also catches a change an earlier install missed.
updater_changed=no
cmp -s "$running_loop" "$root/.docker/updater/loop.sh" || updater_changed=yes

if install; then
    echo "$newest" > .installed-commit
    rm -f .failed-commit
    echo "$(date -u +%FT%TZ) installed $newest"
    [ "$updater_changed" = no ] || replace_updater
else
    echo "$newest" > .failed-commit
    echo "$(date -u +%FT%TZ) $newest failed to install; the next commit is tried"
    exit 1
fi
