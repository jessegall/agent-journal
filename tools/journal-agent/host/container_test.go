package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"journal-agent/client"
)

var localRules = ContainerRules{Arrangement: Local}

var containedRules = ContainerRules{Arrangement: Contained, InstallationName: "journal", AgentImage: "journal/helper@sha256:abc"}

func manifest() ContainerManifest {
	return ContainerManifest{
		Image: "journal/helper@sha256:abc", User: "10001:10001", Workdir: "/workspace", ReadOnlyRoot: true,
		NoNewPrivileges: true, Network: "none",
		Mounts:  []ContainerMount{{Type: MountBind, Source: "/workspaces/helper-7", Target: "/workspace", Writable: false}},
		Budgets: ContainerBudgets{CPUCores: 2, MemoryBytes: 1 << 30, MemorySwapBytes: 1 << 30, Processes: 256, OpenFiles: 1024},
	}
}

func TestAManifestBecomesABoundedUnprivilegedContainer(t *testing.T) {
	arguments, err := manifest().DockerCreateArguments("helper-7", labels(), localRules)
	if err != nil {
		t.Fatal(err)
	}

	for _, want := range []string{"--read-only", "no-new-privileges", "ALL", "10001:10001", "none",
		"type=bind,source=/workspaces/helper-7,target=/workspace,bind-propagation=rprivate,readonly", "journal/helper@sha256:abc"} {
		if !slices.Contains(arguments, want) {
			t.Fatalf("the arguments lack %s: %v", want, arguments)
		}
	}
	if arguments[len(arguments)-1] != "journal/helper@sha256:abc" {
		t.Fatalf("the image is not last: %v", arguments)
	}
}

func TestAManifestAskingForMoreThanAHelperMayHaveIsRefused(t *testing.T) {
	unsafe := []func(*ContainerManifest){
		func(m *ContainerManifest) { m.Privileged = true },
		func(m *ContainerManifest) { m.Capabilities = []string{"SYS_ADMIN"} },
		func(m *ContainerManifest) { m.Image = "journal/helper:latest" },
		func(m *ContainerManifest) { m.Mounts = append(m.Mounts, ContainerMount{Type: MountBind, Source: "/accounts"}) },
		func(m *ContainerManifest) { m.PublishedPorts = []int{8080} },
	}
	for _, change := range unsafe {
		changed := manifest()
		change(&changed)

		if _, err := changed.DockerCreateArguments("helper-7", labels(), localRules); !errors.Is(err, ErrManifestUnsafe) {
			t.Fatalf("an unsafe manifest gave %v", err)
		}
	}
}

func TestASavedAccountInAContainerIsRefusedBeforeAnythingIsCreated(t *testing.T) {
	if err := RequireContainerTransport("direct-processes"); !errors.Is(err, ErrContainerTransportUnsupported) {
		t.Fatalf("got %v", err)
	}
}

func containedManifest() ContainerManifest {
	contained := manifest()
	contained.Mounts = []ContainerMount{
		{Type: MountVolume, Source: "journal-session-7-workspace", Target: "/workspace"},
		{Type: MountDaemonBind, Source: "/srv/journal/accounts/7", Target: "/home/journal/.account", Writable: true},
		{Type: MountVolume, Source: "journal-account-7-projects", Target: "/home/journal/.account/projects", Writable: true},
	}
	contained.SecurityOptions = SecurityOptions{Seccomp: "/etc/journal/seccomp.json", AppArmor: "journal-agent"}
	contained.Budgets.TmpBytes = 128 << 20
	contained.Budgets.HomeBytes = 32 << 20

	return contained
}

func TestAContainedManifestMountsItsVolumesAndDaemonFoldersUnderItsProfiles(t *testing.T) {
	arguments, err := containedManifest().DockerCreateArguments("journal-session-7", labels(), containedRules)
	if err != nil {
		t.Fatal(err)
	}

	for _, want := range []string{
		"type=volume,source=journal-session-7-workspace,target=/workspace,readonly",
		"type=bind,source=/srv/journal/accounts/7,target=/home/journal/.account,bind-propagation=rprivate",
		"type=volume,source=journal-account-7-projects,target=/home/journal/.account/projects",
		"seccomp=/etc/journal/seccomp.json", "apparmor=journal-agent",
		"/tmp:size=134217728", "/run/journal:size=16777216", "/home/journal:size=33554432",
	} {
		if !slices.Contains(arguments, want) {
			t.Fatalf("the arguments lack %s: %v", want, arguments)
		}
	}
}

func TestALocalManifestKeepsItsOldTmpfsSizesInAFixedOrder(t *testing.T) {
	arguments, _ := manifest().DockerCreateArguments("helper-7", labels(), localRules)
	again, _ := manifest().DockerCreateArguments("helper-7", labels(), localRules)

	if !slices.Equal(arguments, again) {
		t.Fatalf("the arguments differ between two runs: %v and %v", arguments, again)
	}

	for _, want := range []string{"/tmp:size=268435456", "/run/journal:size=16777216", "/home/journal:size=67108864"} {
		if !slices.Contains(arguments, want) {
			t.Fatalf("the arguments lack %s: %v", want, arguments)
		}
	}
}

func TestAContainedManifestAskingForAnotherMountIsRefused(t *testing.T) {
	unsafe := []func(*ContainerManifest){
		func(m *ContainerManifest) { m.Mounts[1].Source = "/home/server/accounts" },
		func(m *ContainerManifest) { m.Mounts[1].Source = "/srv/journal/../etc" },
		func(m *ContainerManifest) { m.Mounts[0].Source = "other-session-7-workspace" },
		func(m *ContainerManifest) { m.Mounts[0].Type = MountBind },
		func(m *ContainerManifest) { m.Mounts[2].Target = "/etc" },
		func(m *ContainerManifest) { m.Mounts[2].Target = "/workspace" },
		func(m *ContainerManifest) {
			m.Mounts = append(m.Mounts, ContainerMount{Type: MountVolume, Source: "journal-x", Target: "/workspace"})
		},
		func(m *ContainerManifest) { m.SecurityOptions.Seccomp = "unconfined,apparmor=unconfined" },
	}
	for index, change := range unsafe {
		changed := containedManifest()
		change(&changed)

		if _, err := changed.DockerCreateArguments("journal-session-7", labels(), containedRules); !errors.Is(err, ErrManifestUnsafe) {
			t.Fatalf("unsafe change %d gave %v", index, err)
		}
	}
}

func TestAContainedManifestNamingAnotherImageIsRefused(t *testing.T) {
	changed := containedManifest()
	changed.Image = "journal/helper@sha256:def"

	if _, err := changed.DockerCreateArguments("journal-session-7", labels(), containedRules); !errors.Is(err, ErrManifestUnsafe) {
		t.Fatalf("another image gave %v", err)
	}
}

func fakeImageDocker(t *testing.T, answer string) Containers {
	t.Helper()
	path := filepath.Join(t.TempDir(), "docker")
	script := "#!/bin/sh\n[ \"$1\" = --host ] || exit 3\n" + answer + "\n"
	if err := os.WriteFile(path, []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}

	return Containers{Docker: path, Host: "unix:///run/agent-docker/docker.sock"}
}

func TestTheAgentDaemonMustHoldThePinnedImage(t *testing.T) {
	reference := "journal/agent@sha256:aaa"
	held := fakeImageDocker(t, "echo 'sha256:111 journal/agent@sha256:aaa'")
	if err := held.AssertImagePinned(context.Background(), reference); err != nil {
		t.Fatalf("the pinned image gave %v", err)
	}

	other := fakeImageDocker(t, "echo 'sha256:111 journal/agent@sha256:bbb'")
	err := other.AssertImagePinned(context.Background(), reference)
	if !errors.Is(err, ErrInstallationChanged) || !strings.Contains(err.Error(), "sha256:aaa") || !strings.Contains(err.Error(), "sha256:111") {
		t.Fatalf("another digest gave %v", err)
	}

	missing := fakeImageDocker(t, "echo 'Error: No such image' >&2; exit 1")
	if err := missing.AssertImagePinned(context.Background(), reference); !errors.Is(err, ErrInstallationChanged) {
		t.Fatalf("a missing image gave %v", err)
	}
}

func TestAContainedStartIsProvenByItsContainer(t *testing.T) {
	record := StartRecord{SessionID: "s1", Stage: ExecutionKnown, InContainer: true, Claim: &client.ClaimedStart{StartKey: "k1"}}
	running := ContainerSessions{"s1": {ID: "c1", Session: "s1", Running: true}}
	stopped := ContainerSessions{"s1": {ID: "c1", Session: "s1"}}

	if got := reconcileStart("k1", []StartRecord{record}, running); got != Adopted {
		t.Fatalf("a running container gave %s", got)
	}

	if got := reconcileStart("k1", []StartRecord{record}, stopped); got != Exited {
		t.Fatalf("a stopped container gave %s", got)
	}

	if got := reconcileStart("k1", []StartRecord{record}, ContainerSessions{}); got != Exited {
		t.Fatalf("a container gone from the daemon gave %s", got)
	}
}

func TestAnAttachableManifestGetsATerminalAndHelpersDoNot(t *testing.T) {
	helper, _ := manifest().DockerCreateArguments("helper-7", labels(), localRules)
	main := containedManifest()
	main.Attachable = true
	arguments, _ := main.DockerCreateArguments("journal-session-7", labels(), containedRules)

	if slices.Contains(helper, "--tty") || !slices.Contains(arguments, "--tty") || !slices.Contains(arguments, "--interactive") {
		t.Fatalf("the helper has %v and the session %v", helper, arguments)
	}

	if attach := fakeImageDocker(t, "").Attach(context.Background(), "journal-s1"); !slices.Contains(attach.Args, "--sig-proxy=false") {
		t.Fatalf("the attach is %v", attach.Args)
	}
}
