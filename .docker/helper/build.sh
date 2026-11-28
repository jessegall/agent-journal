#!/bin/sh
# Builds, checks and archives the agent image (the default) or the runner image for one architecture, recorded in
# docs/accounts/docker-images.json; an image the same as the archived one is left as it is.
#   sh .docker/helper/build.sh linux/arm64 [agent|runner]
set -eu

main() {
    . scripts/lib/docker.sh
    claude_code=$(read_version claude-code)
    codex=$(read_version codex)
    architecture="${1:?name the architecture, such as linux/arm64}"
    name="${2:-agent}"
    tag="journal-$name:build"
    archive="images/$name-$(echo "$architecture" | tr / -).tar"
    archived_image="${archive%.tar}.image"
    dockerfile_options=$(select_dockerfile)

    build_image
    built_image=$(read_built_image)
    if is_archived; then
        echo "The $name image did not change: its archive and its record are kept."
    else
        "check_${name}_image"
        check_no_credentials
        save_archive
        record_image
    fi
    remove_build_tag
    sh .docker/helper/prune.sh
}

# The driver's pinned build, from its image folder: the one place a driver's version is written.
read_version() {
    tr -d '[:space:]' < ".docker/drivers/$1/VERSION"
}

# The options that name the image's Dockerfile and, for the runner, its stage.
select_dockerfile() {
    case "$name" in
        agent) echo "--file .docker/helper/Dockerfile" ;;
        runner) echo "--file .docker/app/Dockerfile --target runner" ;;
        *) echo "Name the image agent or runner, not $name." >&2; return 2 ;;
    esac
}

build_image() {
    docker buildx build --platform "$architecture" $dockerfile_options --tag "$tag" --load .
}

read_built_image() {
    docker image inspect --format '{{.Id}}' "$tag"
}

# The archive holds this very image when the id kept beside it is the built one.
is_archived() {
    [ -f "$archive" ] && [ "$(cat "$archived_image" 2>/dev/null)" = "$built_image" ]
}

# Runs a program in the image, with docker run options before the program's name.
run_in_image() {
    local options="" program
    while [ "${1#-}" != "$1" ]; do
        options="$options $1"
        shift
    done
    program=$1
    shift
    retry_docker docker run --rm $options --entrypoint "$program" "$tag" "$@"
}

check_clients() {
    run_in_image claude --version | grep -q "$claude_code"
    run_in_image codex --version | grep -q "$codex"
}

# The agent base holds no driver: each driver is its own image, built on the host from its folder.
check_no_drivers() {
    if run_in_image sh -c 'command -v claude || command -v codex' >/dev/null; then
        echo "The agent base holds a driver: it is refused." >&2
        exit 1
    fi
}

# Claude Code and Codex are native builds, so the agent image holds no Node.
check_no_node() {
    ! run_in_image sh -c 'command -v node || command -v npm' >/dev/null
}

check_agent_image() {
    check_no_drivers
    check_no_node
    check_users
    check_agent_programs
    check_protected_start
    check_protected_files
    check_folders
    check_hook_refusal
    check_mcp_relay
    check_absent_programs
}

check_users() {
    run_in_image id -u | grep -qx 10001
    run_in_image id journal-tools | grep -q 'uid=10002(journal-tools).*10010(journal-work)'
}

# Each program Claude Code and Codex run, their own and the journal's, is there and runnable by the program's user.
check_agent_programs() {
    local program
    while read -r program; do
        if ! run_in_image test -x "$program"; then
            echo "The agent image lacks $program, or its user cannot run it: it is refused." >&2
            exit 1
        fi
    done < .docker/helper/checks/agent-programs.txt
}

# Under the protected init a command run through the shell bridge runs as the executor's user, which cannot read what
# only the program's user may.
check_protected_start() {
    if ! run_in_image --user=0:0 --cap-drop=ALL --cap-add=SETUID --cap-add=SETGID --cap-add=SETPCAP \
        --tmpfs=/run/journal-exec:uid=10002,gid=10001,mode=0750,size=1m /opt/journal/bin/journal-init -- \
        /opt/journal/shell/bash -c 'id -u' | grep -qx 10002; then
        echo "The agent image's protected start runs the model's commands as the program's user: it is refused." >&2
        exit 1
    fi
}

# Root owns what a session must not change: the start programs, the relays and the shell bridge.
check_protected_files() {
    local protected
    for protected in bin/journal-init bin/journal-exec bin/journal-shell bin/journal-hook bin/journal-mcp shell/bash; do
        run_in_image stat -c '%U:%G %a' "/opt/journal/$protected" | grep -qx 'root:root 555'
    done
}

# The tools user shares the workspace through its group, and a new history volume belongs to the account's user.
check_folders() {
    run_in_image stat -c '%u:%g %a' /workspace | grep -qx '10001:10010 2770'
    run_in_image --mount=type=volume,target=/home/journal/.account/projects stat \
        -c '%u:%g %a' /home/journal/.account/projects | grep -qx '10001:10001 700'
}

# A hook call the image's adapter can answer neither from the journal nor from a sealed reply file is refused: exit 2.
check_hook_refusal() {
    local status=0
    run_in_image -i --read-only --network=none /opt/journal/bin/journal-hook claude-code /tmp/hook-replies.json \
        < .docker/helper/checks/prompt-hook.json > /dev/null 2>&1 || status=$?
    [ "$status" -eq 2 ]
}

# The MCP relay runs as the session's user on a read-only root, completes the handshake itself and refuses a call it
# cannot pass on.
check_mcp_relay() {
    run_in_image -i --read-only --network=none --env=JOURNAL_URL=http://journal.invalid --env=JOURNAL_START_TOKEN=check \
        --env=JOURNAL_PROFILE=check --env=JOURNAL_PROFILE_REVISION=1 /opt/journal/bin/journal-mcp \
        < .docker/helper/checks/mcp-calls.json | grep -q '"code":"unavailable"'
}

check_absent_programs() {
    local program
    for program in docker journal-runner journal-terminal; do
        if run_in_image sh -c "command -v $program" >/dev/null 2>&1; then
            echo "The agent image holds $program: it is refused." >&2
            exit 1
        fi
    done
    if run_in_image sh -c "find / -name artisan -not -path '/proc/*' 2>/dev/null | grep -q ."; then
        echo "The agent image holds the journal's console: it is refused." >&2
        exit 1
    fi
}

check_runner_image() {
    check_clients
    run_in_image id -u | grep -qx 10001
    run_in_image --workdir=/app php artisan list >/dev/null
    run_in_image --workdir=/app php artisan accounts:run-sign-ins --help >/dev/null
    run_in_image sh -c "journal-runner 2>&1 | grep -q 'usage: journal-runner'"
    if run_in_image sh -c 'command -v journal-terminal' >/dev/null 2>&1; then
        echo "The runner image holds journal-terminal: it is refused." >&2
        exit 1
    fi
    if run_in_image test -e /app/.env; then
        echo "The runner image holds a .env: it is refused." >&2
        exit 1
    fi
}

check_no_credentials() {
    if docker history --no-trunc "$tag" | grep -Eiq "(token|secret|password)[a-z_]*=|auth\.json|\.credentials\.json"; then
        echo "A layer mentions a credential: the image is refused." >&2
        exit 1
    fi
}

# The rootless agent daemon loads the archive as its own user, so everyone may read it.
save_archive() {
    mkdir -p images
    docker save -o "$archive" "$tag"
    chmod 0644 "$archive"
    printf '%s\n' "$built_image" > "$archived_image"
}

# An image is pinned by its config digest, the id a loaded image keeps.
record_image() {
    local digest
    digest=$(tar -xOf "$archive" manifest.json | python3 .docker/helper/image-id.py)
    python3 .docker/helper/record-image.py docs/accounts/docker-images.json \
        "$name" "$architecture" "$digest" "$claude_code" "$codex"
}

# Only the agent daemon runs the agent image, from the archive; the runner's tag stays for compose.
remove_build_tag() {
    [ "$name" != agent ] || docker image rm "$tag" >/dev/null
}

main "$@"
