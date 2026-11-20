package host

import (
	"errors"
	"slices"
	"testing"
)

func manifest() ContainerManifest {
	return ContainerManifest{
		Image: "journal/helper@sha256:abc", User: "10001:10001", Workdir: "/workspace", ReadOnlyRoot: true,
		NoNewPrivileges: true, Network: "none",
		Mounts:  []ContainerMount{{Source: "/workspaces/helper-7", Target: "/workspace", Writable: false}},
		Budgets: ContainerBudgets{CPUCores: 2, MemoryBytes: 1 << 30, MemorySwapBytes: 1 << 30, Processes: 256, OpenFiles: 1024},
	}
}

func TestAManifestBecomesABoundedUnprivilegedContainer(t *testing.T) {
	arguments, err := manifest().DockerCreateArguments("helper-7", labels())
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
		func(m *ContainerManifest) { m.Mounts = append(m.Mounts, ContainerMount{Source: "/accounts"}) },
		func(m *ContainerManifest) { m.PublishedPorts = []int{8080} },
	}
	for _, change := range unsafe {
		changed := manifest()
		change(&changed)

		if _, err := changed.DockerCreateArguments("helper-7", labels()); !errors.Is(err, ErrManifestUnsafe) {
			t.Fatalf("an unsafe manifest gave %v", err)
		}
	}
}

func TestASavedAccountInAContainerIsRefusedBeforeAnythingIsCreated(t *testing.T) {
	if err := RequireContainerTransport("direct-processes"); !errors.Is(err, ErrContainerTransportUnsupported) {
		t.Fatalf("got %v", err)
	}
}
