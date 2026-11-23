package host

import (
	"context"
	"errors"
	"fmt"
	"journal-agent/shellwords"
	"regexp"
	"strconv"
	"strings"
)

// OperatorWorkspacesRoot is where agent-docker holds the operator's server folders, one per environment.
const OperatorWorkspacesRoot = "/srv/journal/workspaces"

var (
	// ErrWorkspaceFolderNameInvalid refuses a folder name that is not one plain name under the root.
	ErrWorkspaceFolderNameInvalid = errors.New("the workspace folder name is not a plain folder name")
	// ErrWorkspaceFolderMissing refuses a folder the operator's root does not hold.
	ErrWorkspaceFolderMissing = errors.New("the workspace folder does not exist under the operator's root")
	// ErrWorkspaceFolderOutside refuses a folder that is a symlink or resolves outside the operator's root.
	ErrWorkspaceFolderOutside = errors.New("the workspace folder resolves outside the operator's root")
	// ErrWorkspaceFolderSymlinkOut refuses a folder holding a symlink that leaves it.
	ErrWorkspaceFolderSymlinkOut = errors.New("the workspace folder holds a symlink that leaves it")
	// ErrWorkspaceFolderOwner refuses a folder the agent's user does not own.
	ErrWorkspaceFolderOwner = errors.New("the workspace folder is not owned by the agent's user")
)

var workspaceFolderName = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$`)

// folderRefusals map the cause the check container printed to its named refusal.
var folderRefusals = map[string]error{
	"missing":     ErrWorkspaceFolderMissing,
	"outside":     ErrWorkspaceFolderOutside,
	"symlink-out": ErrWorkspaceFolderSymlinkOut,
	"owner":       ErrWorkspaceFolderOwner,
	"unsafe-git":  ErrWorkspaceUnsafe,
}

// CheckFolder checks, on the agent daemon's side, that the operator's folder of that name is a canonical directory of
// its own under the root, owned by the agent's user, with no symlink and no git path that leaves it, and answers the
// daemon-bind mount that puts it at /workspace. A refused folder creates nothing.
func (containers Containers) CheckFolder(ctx context.Context, name string) (ContainerMount, error) {
	if !workspaceFolderName.MatchString(name) || strings.Contains(name, "..") {
		return ContainerMount{}, fmt.Errorf("%w: %q", ErrWorkspaceFolderNameInvalid, name)
	}

	output, err := containers.runScript(ctx, folderCheckScript(OperatorWorkspacesRoot+"/"+name),
		bindMount(OperatorWorkspacesRoot, OperatorWorkspacesRoot, false))
	if err != nil {
		if refusal, named := folderRefusals[strings.TrimSpace(output)]; named {
			return ContainerMount{}, fmt.Errorf("%w: %s", refusal, name)
		}

		return ContainerMount{}, fmt.Errorf("checking the workspace folder %s failed: %w", name, err)
	}

	return ContainerMount{Type: MountDaemonBind, Source: OperatorWorkspacesRoot + "/" + name, Target: workspaceTarget,
		Writable: true}, nil
}

// folderCheckScript prints the one word of the first check the folder fails and exits 1, or exits 0.
func folderCheckScript(folder string) string {
	lines := []string{
		"folder=" + shellwords.Quoted(folder),
		`refuse() { echo "$1"; exit 1; }`,
		`[ -e "$folder" ] || [ -L "$folder" ] || refuse missing`,
		`[ -L "$folder" ] && refuse outside`,
		`[ -d "$folder" ] || refuse missing`,
		`[ "$(readlink -f "$folder")" = "$folder" ] || refuse outside`,
		`[ "$(stat -c %u "$folder")" = "` + strconv.Itoa(agentUID) + `" ] || refuse owner`,
		`find "$folder" -maxdepth 2 -type l | while read -r link; do case "$(readlink -f "$link")" in ` +
			`"$folder"/*) ;; *) echo symlink-out; exit 1;; esac; done || exit 1`,
	}
	for _, reaching := range reachingGitPaths {
		lines = append(lines, `[ -e "$folder/.git/`+reaching+`" ] && refuse unsafe-git`)
	}

	return strings.Join(append(lines, "exit 0"), "\n")
}
