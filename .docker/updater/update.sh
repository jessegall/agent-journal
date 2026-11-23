#!/bin/sh
# Brings an installation up to the newest commit of its branch; the updater's loop runs it every minute.
# It reads JOURNAL_ROOT, JOURNAL_BRANCH and JOURNAL_REPOSITORY, which the updater service passes on.
set -eu

main() {
    root=${JOURNAL_ROOT:?the updater names the installation folder}
    branch=${JOURNAL_BRANCH:?the updater names the branch}
    repository=${JOURNAL_REPOSITORY:?the updater names the repository}
    state=${JOURNAL_UPDATER_STATE:-/var/lib/journal-updater}
    running_loop=${JOURNAL_UPDATER_LOOP:-/usr/local/bin/journal-updater}
    mirror=$state/mirror.git
    images=docs/accounts/docker-images.json
    cd "$root"

    newest=$(find_newest_commit)
    installed=$(read_record .installed-commit)
    failed=$(read_record .failed-commit)
    if [ "$newest" = "$installed" ] || [ "$newest" = "$failed" ]; then exit 0; fi

    echo "$(now) installing $branch $newest (installed: ${installed:-nothing})"
    fetch_commit
    extract_files
    . scripts/lib/settings.sh

    arrangement=$(setting AGENTS_ARRANGEMENT)
    profiles=$(compose_profiles)
    if install; then record_installed; else record_failed; fi
}

find_newest_commit() {
    local commit
    commit=$(git ls-remote "$repository" "refs/heads/$branch" | cut -f1)
    [ -n "$commit" ] || { echo "$(now) the branch $branch is not in $repository" >&2; return 1; }
    echo "$commit"
}

# A commit is tried once: the installed one and the failed one are each kept in a file of the installation.
read_record() {
    cat "$1" 2>/dev/null || true
}

fetch_commit() {
    [ -d "$mirror" ] || git clone --quiet --bare "$repository" "$mirror"
    git -C "$mirror" fetch --quiet --force "$repository" "refs/heads/$branch:refs/heads/$branch"
}

# The commit's files are written into the folder, never checked out there; images built here stay in the record.
extract_files() {
    cp "$images" "$state/images-built-here.json" 2>/dev/null || rm -f "$state/images-built-here.json"
    git -C "$mirror" archive "$newest" | tar -x -C "$root"
    python3 .docker/updater/keep-built-images.py "$state/images-built-here.json" "$images"
    remove_deleted_files
    write_version_file
}

remove_deleted_files() {
    local gone
    has_installed_commit || return 0
    changed_files --no-renames --diff-filter=D | while read -r gone; do
        rm -f "$root/$gone"
    done
}

# The version the journal shows: the commit, its branch and its release tag, if it has one.
write_version_file() {
    local tag
    tag=$(git -C "$mirror" describe --tags --exact-match "$newest" 2>/dev/null || true)
    printf '%s\n%s\n%s\n' "$newest" "$branch" "$tag" > .installed-version
}

# A contained installation also runs the services of the contained profile.
compose_profiles() {
    [ "$arrangement" != contained ] || echo "--profile contained"
}

has_installed_commit() {
    [ -n "$installed" ] && git -C "$mirror" cat-file -e "$installed^{commit}" 2>/dev/null
}

# The paths that differ between the installed commit and the newest; options go to git diff.
changed_files() {
    git -C "$mirror" diff --name-only "$@" "$installed" "$newest"
}

# Whether a migration is among the changed files; options narrow the kind of change, as for changed_files.
migrations_among() {
    changed_files "$@" | grep -qE '(^|/)(Database/Migrations|database/migrations)/'
}

# A first install always migrates.
has_new_migrations() {
    ! has_installed_commit || migrations_among
}

# Nothing is released yet, so a migration that changed or went away rebuilds the database.
schema_changed() {
    has_installed_commit && migrations_among --diff-filter=MDR
}

updater_changed() {
    ! cmp -s "$running_loop" .docker/updater/loop.sh
}

# Every step must pass for the commit to count as installed, so the steps are chained.
install() {
    prune_docker &&
        build_services &&
        pin_images &&
        run_migrations &&
        artisan run access:owner-ensure &&
        enroll_host &&
        publish_release &&
        roll_app &&
        start_services &&
        restart_changed_mounts &&
        artisan exec agents:install &&
        activate_profiles &&
        artisan exec cache:forget installed-version &&
        check_front_door &&
        prune_docker
}

prune_docker() {
    sh .docker/helper/prune.sh >/dev/null
}

build_services() {
    docker compose --progress=quiet build app share web
}

# A contained installation runs its agents and sign-ins on two images pinned by id in .env.
pin_images() {
    [ "$arrangement" = contained ] || return 0
    build_and_pin runner RUNNER_IMAGE && pin_agent_image
}

# The agent image is built only when its own sources changed since the pinned one was built.
pin_agent_image() {
    local sources
    sources=$(agent_source_state) || return 1
    [ "$(cat images/agent.source 2>/dev/null)" != "$sources" ] || return 0
    build_and_pin agent AGENT_IMAGE &&
        printf '%s\n' "$sources" > images/agent.source
}

agent_source_state() {
    git -C "$mirror" rev-parse "$newest:.docker/helper" "$newest:tools/journal-agent" "$newest:tools/journal-check"
}

# Builds one image for this server and writes its id into .env under the setting named.
build_and_pin() {
    local platform built
    platform=$(docker version --format '{{.Server.Os}}/{{.Server.Arch}}') &&
        sh .docker/helper/build.sh "$platform" "$1" &&
        built=$(python3 .docker/updater/newest-image-reference.py "$images") &&
        set_setting "$2" "$built"
}

# Migrations run on the new image before the switch, so they must leave the old code working.
run_migrations() {
    if schema_changed; then
        artisan run migrate:fresh --force
    elif has_new_migrations; then
        artisan run migrate --force
    fi
}

# An artisan command: "run" starts a container for it, before the app runs the new commit; "exec" uses the running app.
artisan() {
    local how=$1
    shift
    case "$how" in
        run) docker compose run --rm -T app php artisan "$@" ;;
        exec) docker compose exec -T app php artisan "$@" ;;
    esac
}

# A rebuilt database has forgotten the contained host, so it is enrolled again and its new id and secret are kept.
enroll_host() {
    local name enrolled host_id secret
    [ "$arrangement" = contained ] && schema_changed || return 0
    name=$(setting AGENTS_INSTALLATION_NAME)
    enrolled=$(artisan run agents:host-enroll "${name:-journal}" --contained --root /workspace) || return 1
    host_id=$(printf '%s\n' "$enrolled" | sed -n 's/^Host \([0-9a-z]*\) is enrolled.*/\1/p')
    secret=$(printf '%s\n' "$enrolled" | tail -n 1 | tr -d '\r')
    [ -n "$host_id" ] && [ -n "$secret" ] || { echo "the rebuilt host's enrolment printed no id or secret"; return 1; }
    set_setting AGENTS_HOST_ID "$host_id"
    (umask 077 && printf '%s\n' "$secret" > secrets/journal_host_secret) && chown 10001:10001 secrets/journal_host_secret
}

# Install lines hand out the journal-agent host of this commit, signed with the operator's key on the updater volume.
publish_release() {
    local version key source project
    version=$(printf '%.12s' "$newest")
    key=$state/release.key
    source=$state/release-source
    [ -f "$key" ] || { echo "no release signing key at $key on the updater volume: put the ed25519 key there"; return 1; }
    project=$(docker compose config --format json | python3 .docker/updater/compose-project-name.py)
    rm -rf "$source" &&
        git clone --quiet --shared "$mirror" "$source" &&
        git -C "$source" checkout --quiet "$newest" &&
        build_release "$project" "$source" "$version" "$key" &&
        rm -rf "$source" &&
        set_setting JOURNAL_RELEASE "$version"
}

# Builds the release in a Go container from a clone of the commit: build_release <project> <clone> <version> <key>
build_release() {
    docker run --rm \
        -v "$1_updater-mirror:$state" \
        -v "$1_releases:/releases" \
        -v journal-release-go-cache:/root/.cache \
        -v journal-release-go-modules:/go/pkg/mod \
        -w "$2/tools/journal-agent" golang:1.26.4-bookworm \
        sh "$2/.docker/updater/build-release.sh" "$3" "$4"
}

# The new app container starts beside the old one, which stops only once the new one is healthy.
roll_app() {
    local old new
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
    local tries=0
    until [ "$(docker inspect -f '{{.State.Health.Status}}' "$1")" = healthy ]; do
        tries=$((tries + 1))
        [ "$tries" -lt 120 ] || { echo "the new app container did not become healthy"; docker rm -f "$1" >/dev/null; return 1; }
        sleep 2
    done
}

start_services() {
    docker compose $profiles up -d --wait --wait-timeout 240
}

# A service reads a mounted file only when it starts, and compose sees no change in it.
restart_changed_mounts() {
    local services
    has_installed_commit || return 0
    changed_files > "$state/changed-files"
    services=$(docker compose $profiles config --format json |
        python3 .docker/updater/services-mounting.py "$root" "$state/changed-files")
    [ -z "$services" ] || docker compose $profiles restart $services
}

# Its output is shown only when it fails, so a failed install says why.
activate_profiles() {
    local activated
    activated=$(artisan exec profile:activate 2>&1) || { printf '%s\n' "$activated"; return 1; }
}

# The journal must answer through its front door, and a page asked for over HTTPS must link its assets over HTTPS.
check_front_door() {
    local front=http://web:8000 tries=0
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

record_installed() {
    echo "$newest" > .installed-commit
    rm -f .failed-commit
    echo "$(now) installed $newest"
    ! updater_changed || replace_updater
}

record_failed() {
    echo "$newest" > .failed-commit
    echo "$(now) $newest failed to install; the next commit is tried"
    exit 1
}

# A short-lived container starts the new updater: started from here, it would stop this container and itself.
replace_updater() {
    local image
    docker compose --profile updater build updater &&
        image=$(docker compose --profile updater config --images updater) &&
        docker run -d --rm --entrypoint sh -v /var/run/docker.sock:/var/run/docker.sock -v "$root:$root" -w "$root" \
            "$image" -c 'sleep 2; docker compose --profile updater up -d --no-deps updater' >/dev/null
}

now() {
    date -u +%FT%TZ
}

main "$@"
