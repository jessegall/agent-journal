#!/bin/sh
# Connects the folder this runs in to the journal at @@ORIGIN@@ with journal-agent release @@VERSION@@.
# Nothing runs before the last line, so a download cut short does nothing.

main() {
    local origin='@@ORIGIN@@' version='@@VERSION@@' relay_sha256='@@RELAY_SHA256@@' platform folder
    set +x
    umask 077
    platform=$(platform_name) || return 1
    folder=$(mktemp -d) || return 1
    trap 'rm -rf "$folder"' EXIT
    trap 'exit 1' HUP INT TERM
    fetch_release "$origin" "$folder" || return 1
    fetch_installer "$origin/releases/$version/$platform/scripts/install-relay.sh" "$folder" || return 1
    check_release "$version" "$platform" "$relay_sha256" "$folder/manifest.json" || return 1
    check_installer "$relay_sha256" "$folder/install-relay.sh" || return 1
    run_installer "$origin" "$version" "$folder"
}

platform_name() {
    local os arch
    case "$(uname -s)" in
        Darwin) os=darwin ;;
        Linux) os=linux ;;
        *) echo "journal: this computer's system is not supported." >&2; return 1 ;;
    esac
    case "$(uname -m)" in
        arm64 | aarch64) arch=arm64 ;;
        x86_64 | amd64) arch=amd64 ;;
        *) echo "journal: this computer's processor is not supported." >&2; return 1 ;;
    esac
    echo "$os-$arch"
}

# No redirect is followed, and any answer but 200 stops the install before the file is used.
fetch_file() {
    local status
    status=$(curl -sS --proto "=${1%%://*}" --max-redirs 0 -o "$2" -w '%{http_code}' "$1") || return 1
    [ "$status" = 200 ] && return 0
    echo "journal: $1 answered $status instead of the file itself; the journal must serve it directly, with no redirect. Nothing was installed." >&2
    return 1
}

fetch_release() {
    local file
    for file in manifest.json manifest.json.sig; do
        fetch_file "$1/releases/current/$file" "$2/$file" && continue
        echo "journal: the release could not be downloaded from $1." >&2
        return 1
    done
}

fetch_installer() {
    fetch_file "$1" "$2/install-relay.sh" && return 0
    echo "journal: the installer could not be downloaded from ${1%%/releases/*}." >&2
    return 1
}

check_release() {
    if ! grep -qF "{\"version\":\"$1\"," "$4"; then
        echo "journal: the journal has a newer release now. Copy a new install line." >&2
        return 1
    fi
    if ! grep -qF "\"name\":\"scripts/install-relay.sh\",\"source\":\"$2/scripts/install-relay.sh\",\"sha256\":\"$3\"" "$4"; then
        echo "journal: the release does not list this installer. Copy a new install line." >&2
        return 1
    fi
}

check_installer() {
    local digest
    if command -v sha256sum >/dev/null 2>&1; then
        digest=$(sha256sum "$2") || return 1
    else
        digest=$(shasum -a 256 "$2") || return 1
    fi
    [ "${digest%% *}" = "$1" ] && return 0
    echo "journal: the installer was damaged on the way. Run the install line again." >&2
    return 1
}

run_installer() {
    sh "$3/install-relay.sh" "$1" "$2" "$3" <<'JOURNAL_TICKET'
@@TICKET@@
JOURNAL_TICKET
}

main "$@"
