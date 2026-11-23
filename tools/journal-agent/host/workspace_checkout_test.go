package host

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"testing"

	"journal-agent/dockerstandin"
)

// mainWorkspace is the main's workspace volume a writer's checkout is cloned from.
var mainWorkspace = ContainerMount{Type: MountVolume, Source: "journal-workspace-main", Target: workspaceTarget}

// printing makes every container of the daemon print the text and end with the exit code.
func printing(daemon *dockerstandin.Daemon, text string, code int) {
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program {
		return dockerstandin.Printing(text, code)
	}
}

func TestACheckoutIsClonedFromTheMainWorkspaceIntoItsOwnBoundedVolume(t *testing.T) {
	containers, daemon := standIn(t, containedRules)

	volume, err := containers.PrepareCheckout(context.Background(), "s9", mainWorkspace, "abc123", 4096)
	if err != nil || volume != "journal-checkout-s9" {
		t.Fatalf("a checkout gave %q, %v", volume, err)
	}

	made, found := daemon.Volume("journal-checkout-s9")
	if !found || made.Options["size"] != "4096" || made.Labels[checkoutSourceLabel] != "journal-workspace-main" {
		t.Fatalf("the checkout volume is %+v", made)
	}
	clone := daemon.Created()[0]
	source := mountIn(t, clone.HostConfig.Mounts, checkoutSource)
	target := mountIn(t, clone.HostConfig.Mounts, workspaceTarget)
	if source.Source != "journal-workspace-main" || !source.ReadOnly || target.Source != "journal-checkout-s9" || target.ReadOnly ||
		clone.HostConfig.NetworkMode != "none" || !clone.HostConfig.ReadonlyRootfs {
		t.Fatalf("the clone ran on %+v with network %s", clone.HostConfig.Mounts, clone.HostConfig.NetworkMode)
	}
	for _, want := range []string{"--no-hardlinks", checkoutSource, "objects/info/alternates"} {
		if !strings.Contains(scriptOf(clone), want) {
			t.Fatalf("the checkout lacks %q in %s", want, scriptOf(clone))
		}
	}
}

// quotaRefusal is how a daemon whose storage cannot bound a volume refuses one with a size.
const quotaRefusal = "quota size requested but no quota support"

func TestADaemonThatCannotBoundAVolumeGetsNoCheckout(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	daemon.Refuse(http.MethodPost, "/volumes/create", http.StatusInternalServerError, quotaRefusal, 1)

	_, err := containers.PrepareCheckout(context.Background(), "s9", mainWorkspace, "abc123", 4096)
	if !errors.Is(err, ErrWorkspaceQuotaUnavailable) || len(daemon.Created()) != 0 {
		t.Fatalf("an unbounded daemon gave %v and ran %d containers", err, len(daemon.Created()))
	}
}

func TestACheckoutThatFailsItsCheckIsRemovedAndNamed(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	printing(daemon, "symlink-out\n", 1)

	_, err := containers.PrepareCheckout(context.Background(), "s9", mainWorkspace, "abc123", 4096)
	if !errors.Is(err, ErrWorkspaceFolderSymlinkOut) {
		t.Fatalf("a checkout with a symlink out gave %v", err)
	}

	if _, kept := daemon.Volume("journal-checkout-s9"); kept {
		t.Fatal("the failed checkout's volume was kept")
	}
}

func TestATakenCheckoutIsRemovedAndADirtyOneKeptAndNamed(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	daemon.AddVolume("journal-checkout-s9", nil)
	printing(daemon, checkoutTaken+"\n", 0)
	kept, err := containers.RemoveCheckout(context.Background(), "s9", mainWorkspace)
	if err != nil || kept != "" {
		t.Fatalf("a taken checkout gave %q, %v", kept, err)
	}

	compared := daemon.Created()[0]
	if _, held := daemon.Volume("journal-checkout-s9"); held || !mountIn(t, compared.HostConfig.Mounts, workspaceTarget).ReadOnly {
		t.Fatal("a taken checkout was not removed, or was compared with a writable mount")
	}

	daemon.AddVolume("journal-checkout-s9", nil)
	printing(daemon, "", 0)
	kept, err = containers.RemoveCheckout(context.Background(), "s9", mainWorkspace)
	if err != nil || kept != "journal-checkout-s9" {
		t.Fatalf("a dirty checkout gave %q, %v", kept, err)
	}

	if _, held := daemon.Volume("journal-checkout-s9"); !held {
		t.Fatal("a dirty checkout was removed")
	}
}

func TestASessionWithoutACheckoutCountsAsRemoved(t *testing.T) {
	containers, daemon := standIn(t, containedRules)

	if kept, err := containers.RemoveCheckout(context.Background(), "s9", mainWorkspace); err != nil || kept != "" {
		t.Fatalf("a session without a checkout gave %q, %v", kept, err)
	}
	if len(daemon.Created()) != 0 {
		t.Fatal("a container ran for a checkout that is not there")
	}
}
