#!/bin/sh
# Connects the folder this runs in to the journal at @@ORIGIN@@ with journal-agent release @@VERSION@@.
# Nothing runs before the last line, so a download cut short does nothing.

# Downloads one file from the journal's exact origin: no redirect is followed, and any answer but 200 stops the
# install before the file is used.
journal_fetch() {
    status=$(curl -sS --proto "=${1%%://*}" --max-redirs 0 -o "$2" -w '%{http_code}' "$1") || return 1
    if [ "$status" != 200 ]; then
        echo "journal: $1 answered $status instead of the file itself; the journal must serve it directly, with no redirect. Nothing was installed." >&2
        return 1
    fi
}

journal_install() {
    set +x
    umask 077

    origin='@@ORIGIN@@'
    version='@@VERSION@@'
    relay_sha256='@@RELAY_SHA256@@'
    relay='scripts/install-relay.sh'

    case "$(uname -s)" in
        Darwin) os=darwin ;;
        Linux) os=linux ;;
        *)
            echo "journal: this computer's system is not supported." >&2
            return 1
            ;;
    esac

    case "$(uname -m)" in
        arm64 | aarch64) arch=arm64 ;;
        x86_64 | amd64) arch=amd64 ;;
        *)
            echo "journal: this computer's processor is not supported." >&2
            return 1
            ;;
    esac

    folder=$(mktemp -d) || return 1
    trap 'rm -rf "$folder"' EXIT
    trap 'exit 1' HUP INT TERM

    for file in manifest.json manifest.json.sig; do
        if ! journal_fetch "$origin/releases/current/$file" "$folder/$file"; then
            echo "journal: the release could not be downloaded from $origin." >&2
            return 1
        fi
    done

    if ! journal_fetch "$origin/releases/$version/$os-$arch/$relay" "$folder/install-relay.sh"; then
        echo "journal: the installer could not be downloaded from $origin." >&2
        return 1
    fi

    if ! grep -qF "{\"version\":\"$version\"," "$folder/manifest.json"; then
        echo "journal: the journal has a newer release now. Copy a new install line." >&2
        return 1
    fi

    if ! grep -qF "\"name\":\"$relay\",\"source\":\"$os-$arch/$relay\",\"sha256\":\"$relay_sha256\"" "$folder/manifest.json"; then
        echo "journal: the release does not list this installer. Copy a new install line." >&2
        return 1
    fi

    if command -v sha256sum >/dev/null 2>&1; then
        digest=$(sha256sum "$folder/install-relay.sh") || return 1
    else
        digest=$(shasum -a 256 "$folder/install-relay.sh") || return 1
    fi

    if [ "${digest%% *}" != "$relay_sha256" ]; then
        echo "journal: the installer was damaged on the way. Run the install line again." >&2
        return 1
    fi

    sh "$folder/install-relay.sh" "$origin" "$version" "$folder" <<'JOURNAL_TICKET'
@@TICKET@@
JOURNAL_TICKET
}

journal_install
