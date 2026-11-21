package host

import (
	"context"
	"errors"
	"strings"
	"testing"
)

func TestACheckoutIsClonedFromTheMainWorkspaceIntoItsOwnBoundedVolume(t *testing.T) {
	containers, folder := recordingDocker(t, "exit 0")

	volume, err := containers.PrepareCheckout(context.Background(), "s9", "journal-workspace-main", "abc123", 4096)
	if err != nil || volume != "journal-checkout-s9" {
		t.Fatalf("a checkout gave %q, %v", volume, err)
	}

	calls := recorded(t, folder, "call-")
	for _, want := range []string{"volume create", "size=4096", "journal.checkout-source=journal-workspace-main",
		"source=journal-workspace-main,target=/source,readonly", "source=journal-checkout-s9,target=/workspace",
		"--network none", "--no-hardlinks", "/source", "objects/info/alternates"} {
		if !strings.Contains(calls, want) {
			t.Fatalf("the checkout lacks %q in %s", want, calls)
		}
	}
}

func TestADaemonThatCannotBoundAVolumeGetsNoCheckout(t *testing.T) {
	containers := fakeImageDocker(t, `if [ "$3" = volume ]; then echo "quota size requested but no quota support" >&2; exit 1; fi; `+
		`echo "a container ran" >&2; exit 1`)
	containers.Rules = containedRules

	_, err := containers.PrepareCheckout(context.Background(), "s9", "journal-workspace-main", "abc123", 4096)
	if !errors.Is(err, ErrWorkspaceQuotaUnavailable) {
		t.Fatalf("an unbounded daemon gave %v", err)
	}
}

func TestACheckoutThatFailsItsCheckIsRemovedAndNamed(t *testing.T) {
	containers, folder := recordingDocker(t, "echo symlink-out; exit 1")

	_, err := containers.PrepareCheckout(context.Background(), "s9", "journal-workspace-main", "abc123", 4096)
	if !errors.Is(err, ErrWorkspaceFolderSymlinkOut) {
		t.Fatalf("a checkout with a symlink out gave %v", err)
	}

	if !strings.Contains(recorded(t, folder, "call-"), "volume rm --force journal-checkout-s9") {
		t.Fatal("the failed checkout's volume was kept")
	}
}

func TestATakenCheckoutIsRemovedAndADirtyOneKeptAndNamed(t *testing.T) {
	taken, folder := recordingDocker(t, "echo taken")
	kept, err := taken.RemoveCheckout(context.Background(), "s9")
	if err != nil || kept != "" {
		t.Fatalf("a taken checkout gave %q, %v", kept, err)
	}

	if !strings.Contains(recorded(t, folder, "call-"), "volume rm journal-checkout-s9") {
		t.Fatal("a taken checkout was not removed")
	}

	dirty, folder := recordingDocker(t, "exit 0")
	kept, err = dirty.RemoveCheckout(context.Background(), "s9")
	if err != nil || kept != "journal-checkout-s9" {
		t.Fatalf("a dirty checkout gave %q, %v", kept, err)
	}

	if strings.Contains(recorded(t, folder, "call-"), "volume rm") {
		t.Fatal("a dirty checkout was removed")
	}
}

func TestASessionWithoutACheckoutCountsAsRemoved(t *testing.T) {
	containers := fakeImageDocker(t, `echo "Error: No such volume: journal-checkout-s9" >&2; exit 1`)
	containers.Rules = containedRules

	if kept, err := containers.RemoveCheckout(context.Background(), "s9"); err != nil || kept != "" {
		t.Fatalf("a session without a checkout gave %q, %v", kept, err)
	}
}
