#!/bin/sh
# The second stage of an install line: checks this folder and this computer before the ticket is spent, installs the
# verified journal-agent release, connects the folder and puts the journal command on PATH.
# Arguments: the journal's origin, the release version and the folder holding the manifest and its signature.
# The ticket arrives on standard input only.

set -u
umask 077

origin=$1
version=$2
downloads=$3
ticket=$(head -n 1)

refuse() {
    echo "journal: $1" >&2
    exit 1
}

case "$(uname -s)" in
    Darwin) os=darwin ;;
    Linux) os=linux ;;
    *) refuse "this computer's system is not supported. Supported: macOS and Linux, on arm64 or amd64." ;;
esac

case "$(uname -m)" in
    arm64 | aarch64) arch=arm64 ;;
    x86_64 | amd64) arch=amd64 ;;
    *) refuse "this computer's processor is not supported. Supported: macOS and Linux, on arm64 or amd64." ;;
esac

target="$os-$arch"

for tool in sh curl mktemp; do
    command -v "$tool" >/dev/null 2>&1 || refuse "$tool is needed and was not found."
done

if command -v sha256sum >/dev/null 2>&1; then
    digest_of() { sha256sum "$1" | cut -d ' ' -f 1; }
elif command -v shasum >/dev/null 2>&1; then
    digest_of() { shasum -a 256 "$1" | cut -d ' ' -f 1; }
else
    refuse "a SHA-256 tool (sha256sum or shasum) is needed and was not found."
fi

root=$(pwd -P)
has_git=0
if command -v git >/dev/null 2>&1 && top=$(git rev-parse --show-toplevel 2>/dev/null); then
    root=$top
    has_git=1
fi
echo "journal: connecting the project folder $root"

if [ -L "$root/.journal" ]; then
    refuse "$root/.journal is a link. Remove it, then run the install line again."
fi

if [ "$has_git" = 1 ] && [ -n "$(git -C "$root" ls-files -- .journal)" ]; then
    refuse "$root/.journal is tracked by Git. Untrack it (git rm -r --cached .journal), then run the install line again."
fi

if [ -d "$root/.journal" ] && [ ! -f "$root/.journal/connection.json" ]; then
    refuse "$root/.journal holds a journal version 5 installation. Connect a separate clean checkout of this project instead."
fi

installation="$HOME/.journal-agent/releases/$version"
dispatcher="$installation/bin/journal"

# Where the journal command will come from: a dispatcher of this journal already wins on PATH, a writable folder that
# wins on PATH, or ~/.local/bin with one owned PATH line in the shell's startup file.
winner=$(command -v journal 2>/dev/null || true)
link_folder=""
startup_file=""
case "$winner" in
    "")
        saved_ifs=$IFS
        IFS=:
        set -f
        for folder in $PATH; do
            case "$folder" in
                "$HOME"/*)
                    if [ -d "$folder" ] && [ -w "$folder" ]; then
                        link_folder=$folder
                        break
                    fi
                    ;;
            esac
        done
        set +f
        IFS=$saved_ifs
        if [ -z "$link_folder" ]; then
            link_folder="$HOME/.local/bin"
            case "$(basename "${SHELL:-sh}")" in
                zsh) startup_file="$HOME/.zshrc" ;;
                bash) startup_file="$HOME/.bashrc" ;;
                *) refuse "no folder on PATH can hold the journal command. Add a folder of your home to PATH, then run the install line again." ;;
            esac
        fi
        ;;
    /*)
        case "$(readlink "$winner" 2>/dev/null || true)" in
            "$HOME"/.journal-agent/releases/*/bin/journal) ;;
            *) refuse "another journal command wins on PATH at $winner. Remove it or put it later on PATH, then run the install line again." ;;
        esac
        ;;
    *) refuse "journal is an alias or a function in this shell ($winner). Remove it, then run the install line again." ;;
esac

# The journal-agent of the target is checked against the manifest before it runs; it verifies the manifest's
# signature itself, with the key it pins, and installs the rest.
program="$downloads/journal-agent"
program_line="\"name\":\"bin/journal-agent\",\"source\":\"$target/bin/journal-agent\",\"sha256\":\""
program_sha256=$(grep -o "$program_line[0-9a-f]*" "$downloads/manifest.json" | sed "s/.*sha256\":\"//")
[ -n "$program_sha256" ] || refuse "the release has no journal-agent for $target."

if ! curl -fsSL --proto '=https' -o "$program" "$origin/releases/$version/$target/bin/journal-agent"; then
    refuse "journal-agent could not be downloaded from $origin."
fi
[ "$(digest_of "$program")" = "$program_sha256" ] || refuse "journal-agent was damaged on the way. Run the install line again."
chmod 700 "$program"

"$program" install-release --origin "$origin" --manifest "$downloads/manifest.json" \
    --signature "$downloads/manifest.json.sig" --into "$installation" || refuse "the release could not be installed."

(cd "$root" && printf '%s\n' "$ticket" | "$installation/bin/journal-agent" connect --ticket-stdin --origin "$origin") ||
    exit 1

# Each change made outside the project is recorded, so disconnecting the last project can undo it when unchanged.
changes="$HOME/.journal-agent/machine-changes"
mkdir -p "$HOME/.journal-agent" && chmod 700 "$HOME/.journal-agent"

if [ -n "$link_folder" ]; then
    [ -e "$link_folder/journal" ] || [ -L "$link_folder/journal" ] || printf 'link\t%s\n' "$link_folder/journal" >>"$changes"
    mkdir -p "$link_folder"
    ln -sf "$dispatcher" "$link_folder/journal"
fi

if [ -n "$startup_file" ] && ! grep -qF '# journal: the journal command' "$startup_file" 2>/dev/null; then
    printf '\n# journal: the journal command\nexport PATH="$HOME/.local/bin:$PATH"\n' >>"$startup_file"
    printf 'startup\t%s\n' "$startup_file" >>"$changes"
fi

echo "journal: connected. In this terminal run: \"$dispatcher\" status"
echo "journal: in a new terminal run: journal status"
