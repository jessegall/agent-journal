package host

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"journal-agent/shellwords"
)

// ErrAccountFolderUnsafe refuses a protected-account start whose sign-in folder, or a folder above it, is not private
// to the program's user; it names the first path that fails and why.
var ErrAccountFolderUnsafe = errors.New("the account folder is not private to the program's user")

// journalRoot is the agent daemon's folder above the accounts root, which root alone may write.
const journalRoot = "/srv/journal"

// CheckAccountFolder checks, on the agent daemon's side, that the account's folder is a real folder owned by the
// program's user with mode 0700 and no ACL, that everything in it is that user's with no group or other bits and no
// link leaving it, and that the folders above it are root's and not writable by others. It prints only a verdict.
func (containers Containers) CheckAccountFolder(ctx context.Context, accountID string) error {
	if !plainAccountID.MatchString(accountID) {
		return fmt.Errorf("%w: %q is not a plain account id", ErrAccountFolderUnsafe, accountID)
	}

	if err := containers.makeHistoryMountPoint(ctx, accountID); err != nil {
		return err
	}

	rootMount := []string{"--mount", "type=bind,source=" + journalRoot + ",target=" + journalRoot + ",readonly"}
	output, err := containers.runCheckWith(ctx, rootMount, "sh", "-c",
		accountFolderScript(journalRoot, accountID, agentUID, 0))
	if err == nil {
		return nil
	}

	return accountFolderRefusal(output, err)
}

// accountFolderRefusal reads the check's last line, a reason and a path split by a tab, into the named refusal.
func accountFolderRefusal(output string, err error) error {
	reason, path, named := strings.Cut(lastLine(output), "\t")
	if !named {
		return fmt.Errorf("checking the account folder failed: %w: %s", err, output)
	}

	return fmt.Errorf("%w: %s %s", ErrAccountFolderUnsafe, path, reason)
}

// accountFolderScript prints the first failing check as a reason, a tab and the path, and exits 1, or exits 0. The
// owner and the root's owner are parameters, so a test runs it as its own user.
func accountFolderScript(root, accountID string, owner, rootOwner int) string {
	user := strconv.Itoa(owner)

	return strings.Join([]string{
		"root=" + shellwords.Quoted(root),
		`folder="$root/accounts/"` + shellwords.Quoted(accountID),
		`refuse() { printf '%s\t%s\n' "$1" "$2"; exit 1; }`,
		`for above in "$root" "$root/accounts"; do`,
		`  [ "$(stat -c %u "$above")" = "` + strconv.Itoa(rootOwner) + `" ] || refuse "is not owned by root" "$above"`,
		`  [ $(( 0$(stat -c %a "$above") & 022 )) = 0 ] || refuse "is writable by group or other" "$above"`,
		`done`,
		`[ -L "$folder" ] && refuse "is a link" "$folder"`,
		`[ -d "$folder" ] || refuse "is not a folder" "$folder"`,
		`[ "$(stat -c %u:%g:%a "$folder")" = "` + user + ":" + user + `:700" ] || ` +
			`refuse "is not owned ` + user + ":" + user + ` with mode 0700" "$folder"`,
		`case "$(ls -ld "$folder")" in ??????????+*) refuse "has ACL entries" "$folder";; esac`,
		`stranger=$(find "$folder" -mindepth 1 ! -type l ! -uid ` + user + ` -print -quit)`,
		`[ -z "$stranger" ] || refuse "is not owned by ` + user + `" "$stranger"`,
		`open=$(find "$folder" -mindepth 1 ! -type l -perm /077 -print -quit)`,
		`[ -z "$open" ] || refuse "is readable or writable by group or other" "$open"`,
		`leaving=$(find "$folder" -type l -exec sh -c 'for link; do case "$(readlink -f "$link")" in ` +
			`"$0"/*) ;; *) echo "$link"; exit 0;; esac; done' "$folder" {} + | head -n 1)`,
		`[ -z "$leaving" ] || refuse "is a link leading out of the folder" "$leaving"`,
		"exit 0",
	}, "\n")
}

// historyFolder is the folder in an account where each session's own history volume is mounted.
const historyFolder = "projects"

// makeHistoryMountPoint makes the account's history folder as the program's user with mode 0700 when it is missing,
// so the agent daemon never makes it as root while it mounts a session's history volume there. It runs with only the
// account's own folder mounted, so it reaches nothing above it.
func (containers Containers) makeHistoryMountPoint(ctx context.Context, accountID string) error {
	accountMount := []string{"--mount", "type=bind,source=" + journalRoot + "/accounts/" + accountID + ",target=/account"}
	output, err := containers.runCheckWith(ctx, accountMount, "sh", "-c",
		`[ -L /account/`+historyFolder+` ] || [ -e /account/`+historyFolder+` ] || mkdir -m 0700 /account/`+historyFolder)
	if err != nil {
		return fmt.Errorf("%w: making its history folder failed: %v: %s", ErrAccountFolderUnsafe, err, output)
	}

	return nil
}
