package host

import (
	"context"
	"errors"
	"strings"
	"testing"
)

func TestAPlainFolderIsCheckedOnTheDaemonAndBoundAtTheWorkspace(t *testing.T) {
	containers, folder := recordingDocker(t, "exit 0")

	mount, err := containers.CheckFolder(context.Background(), "main")
	if err != nil {
		t.Fatalf("a plain folder gave %v", err)
	}

	if mount.Type != MountDaemonBind || mount.Source != "/srv/journal/workspaces/main" || mount.Target != "/workspace" {
		t.Fatalf("the folder's mount is %+v", mount)
	}

	calls := recorded(t, folder, "call-")
	for _, want := range []string{"source=/srv/journal/workspaces,target=/srv/journal/workspaces,readonly", "--network none",
		"--cap-drop ALL", "readlink -f", "objects/info/alternates"} {
		if !strings.Contains(calls, want) {
			t.Fatalf("the daemon-side check lacks %q in %s", want, calls)
		}
	}
}

func TestAFolderTheCheckRefusesIsNamedByItsCause(t *testing.T) {
	cases := map[string]error{
		"echo missing; exit 1":     ErrWorkspaceFolderMissing,
		"echo outside; exit 1":     ErrWorkspaceFolderOutside,
		"echo symlink-out; exit 1": ErrWorkspaceFolderSymlinkOut,
		"echo owner; exit 1":       ErrWorkspaceFolderOwner,
		"echo unsafe-git; exit 1":  ErrWorkspaceUnsafe,
	}

	for onRun, want := range cases {
		containers, _ := recordingDocker(t, onRun)
		if _, err := containers.CheckFolder(context.Background(), "main"); !errors.Is(err, want) {
			t.Fatalf("%q gave %v, not %v", onRun, err, want)
		}
	}
}

func TestAFolderNameThatIsNotOnePlainNameIsRefusedBeforeAnyContainer(t *testing.T) {
	for _, name := range []string{"..", "../etc", "a/b", "", ".hidden", "a..b"} {
		containers, folder := recordingDocker(t, "exit 0")
		if _, err := containers.CheckFolder(context.Background(), name); !errors.Is(err, ErrWorkspaceFolderNameInvalid) {
			t.Fatalf("%q gave %v", name, err)
		}

		if recorded(t, folder, "call-") != "" {
			t.Fatalf("%q ran a container", name)
		}
	}
}
