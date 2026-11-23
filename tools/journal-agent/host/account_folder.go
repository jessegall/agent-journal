package host

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"regexp"
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

	if err := containers.keepAccountFilesPrivate(ctx, accountID); err != nil {
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

// keepAccountFilesPrivate takes the group and other bits off everything in the account's folder, as the program's
// user and with only that folder mounted. The client makes some of its own folders, such as its cache, with the wider
// mode of its file mask (the workspace it shares with the executor needs that mask); under the 0700 folder they were
// never reachable, and the check that follows refuses any that are left. Links are not followed.
func (containers Containers) keepAccountFilesPrivate(ctx context.Context, accountID string) error {
	accountMount := []string{"--mount", "type=bind,source=" + journalRoot + "/accounts/" + accountID + ",target=/account"}
	output, err := containers.runCheckWith(ctx, accountMount, "sh", "-c", keepPrivateScript("/account"))
	if err != nil {
		return fmt.Errorf("%w: keeping its files private failed: %v: %s", ErrAccountFolderUnsafe, err, output)
	}

	return nil
}

// keepPrivateScript takes the group and other bits off every file and folder under the folder.
func keepPrivateScript(folder string) string {
	return `find ` + shellwords.Quoted(folder) + ` -mindepth 1 ! -type l -exec chmod go-rwx {} +`
}

// accountsFolder is the agent daemon's folder of every account's own sign-in folder.
const accountsFolder = journalRoot + "/accounts"

// accountFolderCapabilities are all a root container needs to keep the accounts root root's, to hand a new account
// folder to the program's user, and to remove a folder that user filled.
var accountFolderCapabilities = []string{"--cap-add", "CHOWN", "--cap-add", "FOWNER", "--cap-add", "DAC_OVERRIDE"}

// plainOperationID is the id a sign-in names its folder make by: letters, digits and dashes, such as a UUID.
var plainOperationID = regexp.MustCompile(`^[A-Za-z0-9-]{8,64}$`)

// folderOperationMark is the file in an account folder naming the make that made it.
const folderOperationMark = ".journal-folder-operation"

// MakeAccountFolder makes the account's folder, and its history folder, owned by the program's user with mode 0700,
// and keeps the accounts root root's with mode 0755, so the program's user can neither replace one account's folder
// nor make another. The folder is pinned to the operation that made it: the same operation sent again finds its own
// folder and sets its owner and mode again, a folder another operation made is refused, and a link is refused.
func (containers Containers) MakeAccountFolder(ctx context.Context, accountID, operation string) error {
	if !plainAccountID.MatchString(accountID) {
		return fmt.Errorf("%w: %q is not a plain account id", ErrAccountFolderUnsafe, accountID)
	}

	if !plainOperationID.MatchString(operation) {
		return fmt.Errorf("%w: %q is not a plain operation id", ErrAccountFolderUnsafe, operation)
	}

	if output, err := containers.runAsRoot(ctx, makeAccountFolderScript("/accounts", accountID, operation, strconv.Itoa(agentUID))); err != nil {
		return fmt.Errorf("making the account folder failed: %w: %s", err, output)
	}

	return nil
}

// makeAccountFolderScript is the root shell script that makes or reconciles one account folder under root.
func makeAccountFolderScript(root, accountID, operation, user string) string {
	owner := user + ":" + user

	return strings.Join([]string{
		"set -e",
		"chown 0:0 " + root + " && chmod 0755 " + root,
		`folder=` + root + `/` + accountID,
		`mark="$folder/` + folderOperationMark + `"`,
		`[ -L "$folder" ] && { echo "the account folder is a link"; exit 1; }`,
		`if [ -e "$folder" ]; then`,
		`  [ -L "$mark" ] && { echo "the folder's operation mark is a link"; exit 1; }`,
		`  if [ -f "$mark" ] && [ "$(cat "$mark")" != "` + operation + `" ]; then echo "another sign-in made this folder"; exit 1; fi`,
		`else`,
		`  mkdir -m 0700 "$folder"`,
		`fi`,
		`chown ` + owner + ` "$folder" && chmod 0700 "$folder"`,
		`[ -f "$mark" ] || printf '%s' "` + operation + `" > "$mark"`,
		// The mark is the program's user's and private like every file of the folder, or the start's own check of the
		// folder refuses it; set on every make, so a folder made before this heals on its next sign-in.
		`chown ` + owner + ` "$mark" && chmod 0600 "$mark"`,
		`[ -e "$folder/` + historyFolder + `" ] || { mkdir -m 0700 "$folder/` + historyFolder + `"; chown ` + owner + ` "$folder/` +
			historyFolder + `"; }`,
	}, "\n")
}

// accountFileName is a file name in an account's folder the host may write: one plain name, no folder.
var accountFileName = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9._-]*$`)

// WriteAccountFile writes one file into the account's folder for the program's user, owned by it with mode 0600,
// replacing a file of that name and refusing a link in its place, so a protected start finds a setting that no
// argument can carry.
func (containers Containers) WriteAccountFile(ctx context.Context, accountID, name string, content []byte) error {
	if !plainAccountID.MatchString(accountID) {
		return fmt.Errorf("%w: %q is not a plain account id", ErrAccountFolderUnsafe, accountID)
	}

	if !accountFileName.MatchString(name) {
		return fmt.Errorf("%w: %q is not a plain file name", ErrAccountFolderUnsafe, name)
	}

	user := strconv.Itoa(agentUID)
	file := "/accounts/" + accountID + "/" + name
	script := strings.Join([]string{
		"set -e",
		`[ -L "` + file + `" ] && { echo "the account file is a link"; exit 1; }`,
		"printf %s " + shellwords.Quoted(base64.StdEncoding.EncodeToString(content)) + ` | base64 -d > "` + file + `.new"`,
		`chown ` + user + ":" + user + ` "` + file + `.new"`,
		`chmod 0600 "` + file + `.new"`,
		`mv -f "` + file + `.new" "` + file + `"`,
	}, "\n")
	if output, err := containers.runAsRoot(ctx, script); err != nil {
		return fmt.Errorf("writing the account file %s failed: %w: %s", name, err, output)
	}

	return nil
}

// RemoveAccountFolder removes the account's folder and everything in it, or a link standing in its place without
// following it.
func (containers Containers) RemoveAccountFolder(ctx context.Context, accountID string) error {
	if !plainAccountID.MatchString(accountID) {
		return fmt.Errorf("%w: %q is not a plain account id", ErrAccountFolderUnsafe, accountID)
	}

	script := `rm -rf -- /accounts/` + accountID + ` && [ ! -e /accounts/` + accountID + ` ] && [ ! -L /accounts/` + accountID + ` ]`
	if output, err := containers.runAsRoot(ctx, script); err != nil {
		return fmt.Errorf("removing the account folder failed: %w: %s", err, output)
	}

	return nil
}

// runAsRoot runs a shell script in the agent image as root, with no network, only the accounts folder mounted and
// only the capabilities an account folder needs.
func (containers Containers) runAsRoot(ctx context.Context, script string) (string, error) {
	run := []string{
		"run", "--rm", "--network", "none", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
		"--user", "0:0", "--label", installationLabel + "=" + string(containers.Rules.InstallationName),
		"--mount", "type=bind,source=" + accountsFolder + ",target=/accounts",
	}
	run = append(run, accountFolderCapabilities...)
	run = append(run, "--entrypoint", "sh", containers.Rules.AgentImage, "-c", script)
	output, err := containers.command(ctx, run...).CombinedOutput()

	return strings.TrimSpace(string(output)), err
}
