package host

import (
	"context"
	"errors"
	"slices"
	"strings"
	"testing"
)

func TestAPlainFolderIsCheckedOnTheDaemonAndBoundAtTheWorkspace(t *testing.T) {
	containers, daemon := standIn(t, containedRules)

	mount, err := containers.CheckFolder(context.Background(), "main")
	if err != nil {
		t.Fatalf("a plain folder gave %v", err)
	}

	if mount.Type != MountDaemonBind || mount.Source != "/srv/journal/workspaces/main" || mount.Target != "/workspace" {
		t.Fatalf("the folder's mount is %+v", mount)
	}

	check := daemon.Created()[0]
	root := mountIn(t, check.HostConfig.Mounts, OperatorWorkspacesRoot)
	if root.Source != OperatorWorkspacesRoot || !root.ReadOnly || check.HostConfig.NetworkMode != "none" ||
		!slices.Equal(check.HostConfig.CapDrop, []string{"ALL"}) {
		t.Fatalf("the daemon-side check ran on %+v, network %s", check.HostConfig.Mounts, check.HostConfig.NetworkMode)
	}
	for _, want := range []string{"readlink -f", "objects/info/alternates"} {
		if !strings.Contains(scriptOf(check), want) {
			t.Fatalf("the daemon-side check lacks %q in %s", want, scriptOf(check))
		}
	}
}

func TestAFolderTheCheckRefusesIsNamedByItsCause(t *testing.T) {
	cases := map[string]error{
		"missing":     ErrWorkspaceFolderMissing,
		"outside":     ErrWorkspaceFolderOutside,
		"symlink-out": ErrWorkspaceFolderSymlinkOut,
		"owner":       ErrWorkspaceFolderOwner,
		"unsafe-git":  ErrWorkspaceUnsafe,
	}

	for cause, want := range cases {
		containers, daemon := standIn(t, containedRules)
		printing(daemon, cause+"\n", 1)
		if _, err := containers.CheckFolder(context.Background(), "main"); !errors.Is(err, want) {
			t.Fatalf("%q gave %v, not %v", cause, err, want)
		}
	}
}

func TestAFolderNameThatIsNotOnePlainNameIsRefusedBeforeAnyContainer(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	for _, name := range []string{"..", "../etc", "a/b", "", ".hidden", "a..b"} {
		if _, err := containers.CheckFolder(context.Background(), name); !errors.Is(err, ErrWorkspaceFolderNameInvalid) {
			t.Fatalf("%q gave %v", name, err)
		}
	}

	if len(daemon.Requests()) != 0 {
		t.Fatalf("a refused name reached the daemon: %v", daemon.Requests())
	}
}
