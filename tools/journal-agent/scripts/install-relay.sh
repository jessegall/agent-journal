#!/bin/sh
# The second stage of an install line: checks this folder and computer, installs the verified release, connects the
# folder and puts journal on PATH.   sh install-relay.sh <origin> <version> <downloads folder>   (ticket on stdin)
set -u

main() {
    local origin=$1 version=$2 downloads=$3 ticket target root installation placement connected
    ticket=$(head -n 1)
    umask 077
    target=$(target_name "$downloads") || exit 1
    check_tools
    root=$(find_project_root)
    echo "journal: connecting the project folder $root"
    check_project_folder "$root"
    installation="$HOME/.journal-agent/releases/$version"
    placement=$(find_command_placement) || exit 1
    install_release "$origin" "$version" "$downloads" "$target" "$installation"
    connect_folder "$root" "$ticket" "$origin" "$installation"
    connected=$?
    place_command "$placement" "$installation/bin/journal" "$root"
    notify_connected "$connected" "$installation/bin/journal"
    exit "$connected"
}

refuse() {
    echo "journal: $1" >&2
    exit 1
}

# No redirect is followed, and any answer but 200 stops the install before the file is used.
fetch_file() {
    local status
    status=$(curl -sS --proto "=${1%%://*}" --max-redirs 0 -o "$2" -w '%{http_code}' "$1") || return 1
    [ "$status" = 200 ] ||
        refuse "$1 answered $status instead of the file itself; the journal must serve it directly, with no redirect. Nothing was installed."
}

list_builds() {
    grep -o '"source":"[a-z0-9]*-[a-z0-9]*/bin/journal-agent"' "$1/manifest.json" 2>/dev/null |
        sed 's/"source":"//; s/\/bin\/journal-agent"//' | sort -u | tr '\n' ' '
}

target_name() {
    local os arch unsupported
    unsupported="this computer ($(uname -s) $(uname -m)) is not supported. This release has builds for: $(list_builds "$1"). The install line was not used."
    case "$(uname -s)" in
        Darwin) os=darwin ;;
        Linux) os=linux ;;
        *) refuse "$unsupported" ;;
    esac
    case "$(uname -m)" in
        arm64 | aarch64) arch=arm64 ;;
        x86_64 | amd64) arch=amd64 ;;
        *) refuse "$unsupported" ;;
    esac
    echo "$os-$arch"
}

check_tools() {
    local tool
    for tool in sh curl mktemp; do
        command -v "$tool" >/dev/null 2>&1 || refuse "$tool is needed and was not found."
    done
    command -v sha256sum >/dev/null 2>&1 || command -v shasum >/dev/null 2>&1 ||
        refuse "a SHA-256 tool (sha256sum or shasum) is needed and was not found."
}

read_digest() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" | cut -d ' ' -f 1
    else
        shasum -a 256 "$1" | cut -d ' ' -f 1
    fi
}

# The top of the Git checkout this runs in, or the folder itself outside Git.
find_project_root() {
    git rev-parse --show-toplevel 2>/dev/null || pwd -P
}

check_project_folder() {
    [ ! -L "$1/.journal" ] || refuse "$1/.journal is a link. Remove it, then run the install line again."
    if command -v git >/dev/null 2>&1 && [ -n "$(git -C "$1" ls-files -- .journal 2>/dev/null)" ]; then
        refuse "$1/.journal is tracked by Git. Untrack it (git rm -r --cached .journal), then run the install line again."
    fi
    if [ -d "$1/.journal" ] && [ ! -f "$1/.journal/connection.json" ]; then
        refuse "$1/.journal holds a journal version 5 installation. Connect a separate clean checkout of this project instead."
    fi
}

# Where journal comes from: this journal's dispatcher already wins, the agent-journal launcher wins and runs the
# folder's .journal/journal, a writable home folder on PATH, or ~/.local/bin with a PATH line in the startup file.
find_command_placement() {
    local winner
    winner=$(command -v journal 2>/dev/null || true)
    case "$winner" in
        "") new_command_placement ;;
        /*) find_existing_command_placement "$winner" ;;
        *) refuse "journal is an alias or a function in this shell ($winner). Remove it, then run the install line again." ;;
    esac
}

new_command_placement() {
    local folder
    for folder in $(printf '%s' "$PATH" | tr ':' ' '); do
        case "$folder" in
            "$HOME"/*) [ -d "$folder" ] && [ -w "$folder" ] && { echo "folder $folder"; return; } ;;
        esac
    done
    case "$(basename "${SHELL:-sh}")" in
        zsh) echo "local $HOME/.zshrc" ;;
        bash) echo "local $HOME/.bashrc" ;;
        *) refuse "no folder on PATH can hold the journal command. Add a folder of your home to PATH, then run the install line again." ;;
    esac
}

find_existing_command_placement() {
    case "$(readlink "$1" 2>/dev/null || true)" in
        "$HOME"/.journal-agent/releases/*/bin/journal) echo dispatcher; return ;;
    esac
    grep -q '^# agent-journal: the journal command' "$1" 2>/dev/null && { echo launcher; return; }
    refuse "another journal command wins on PATH at $1. Remove it or put it later on PATH, then run the install line again."
}

# journal-agent is checked against the manifest before it runs; it verifies the manifest's signature and the program list.
install_release() {
    local program="$3/journal-agent" line sha256
    line="\"name\":\"bin/journal-agent\",\"source\":\"$4/bin/journal-agent\",\"sha256\":\""
    sha256=$(grep -o "$line[0-9a-f]*" "$3/manifest.json" | sed "s/.*sha256\":\"//")
    [ -n "$sha256" ] ||
        refuse "this release holds no build matching this computer ($4). It has builds for: $(list_builds "$3"). The install line was not used."
    fetch_file "$1/releases/$2/$4/bin/journal-agent" "$program" ||
        refuse "the download step failed: journal-agent could not be downloaded from $1."
    [ "$(read_digest "$program")" = "$sha256" ] ||
        refuse "the verification step failed: journal-agent was damaged on the way. Run the install line again."
    chmod 700 "$program"
    fetch_file "$1/releases/current/programs.json" "$3/programs.json" ||
        refuse "the download step failed: the journal's program list could not be downloaded from $1."
    "$program" install-release --origin "$1" --manifest "$3/manifest.json" --signature "$3/manifest.json.sig" \
        --programs "$3/programs.json" --into "$5" ||
        refuse "the install-release step failed: the release could not be installed."
}

# Ends 0 once the journal acknowledged the setup, 2 when its relay has not reached the journal yet; the line is spent.
connect_folder() {
    local status
    (cd "$1" && printf '%s\n' "$2" | "$4/bin/journal-agent" connect --ticket-stdin --origin "$3")
    status=$?
    case "$status" in
        0 | 2) return "$status" ;;
        *) refuse "the connect step failed (exit $status). The output above says why." ;;
    esac
}

# Each change outside the project is recorded, so disconnecting the last project can undo it when unchanged.
place_command() {
    local changes="$HOME/.journal-agent/machine-changes"
    mkdir -p "$HOME/.journal-agent" && chmod 700 "$HOME/.journal-agent"
    case "$1" in
        launcher) ln -sf "$2" "$3/.journal/journal" ||
            refuse "the link step failed: the journal command could not be linked into $3/.journal." ;;
        folder\ *) link_command "${1#folder }" "$2" "$changes" ;;
        local\ *) link_command "$HOME/.local/bin" "$2" "$changes" && add_path_line "${1#local }" "$changes" ;;
    esac
}

link_command() {
    [ -e "$1/journal" ] || [ -L "$1/journal" ] || printf 'link\t%s\n' "$1/journal" >> "$3"
    mkdir -p "$1" && ln -sf "$2" "$1/journal" ||
        refuse "the link step failed: the journal command could not be linked into $1."
}

add_path_line() {
    grep -qF '# journal: the journal command' "$1" 2>/dev/null && return 0
    printf '\n# journal: the journal command\nexport PATH="$HOME/.local/bin:$PATH"\n' >> "$1" ||
        refuse "the PATH step failed: $1 could not be changed."
    printf 'startup\t%s\n' "$1" >> "$2"
}

notify_connected() {
    [ "$1" = 0 ] && echo "journal: connected."
    echo "journal: in this terminal run: \"$2\" status"
    echo "journal: in a new terminal run: journal status"
}

main "$@"
