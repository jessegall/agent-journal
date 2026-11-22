package host

import (
	"context"
	"errors"
	"testing"
)

func TestAnArrangementIsLocalOrContainedAndNothingElse(t *testing.T) {
	for _, value := range []string{"local", "contained"} {
		arrangement, err := ParseArrangement(value)
		if err != nil || string(arrangement) != value {
			t.Fatalf("ParseArrangement(%q) = %q, %v", value, arrangement, err)
		}
	}

	if _, err := ParseArrangement("sideways"); !errors.Is(err, ErrUnknownArrangement) {
		t.Fatalf("an unknown arrangement gave %v, want ErrUnknownArrangement", err)
	}
}

func TestAContainedHostNeedsTheDaemonSocketAndItsInstallationName(t *testing.T) {
	if err := Contained.AssertServable("", "journal"); !errors.Is(err, ErrContainedNeedsDocker) {
		t.Fatalf("contained without --docker gave %v", err)
	}

	if err := Contained.AssertServable("unix:///run/agent-docker/docker.sock", ""); !errors.Is(err, ErrContainedNeedsInstallationName) {
		t.Fatalf("contained without --installation-name gave %v", err)
	}

	if err := Contained.AssertServable("unix:///run/agent-docker/docker.sock", "journal"); err != nil {
		t.Fatalf("contained with both flags gave %v", err)
	}

	if err := Local.AssertServable("", ""); err != nil {
		t.Fatalf("local without the flags gave %v", err)
	}
}

func TestAContainedHostNamesBothImagesByDigest(t *testing.T) {
	unpinned := PinnedImages{Agent: "journal/agent:latest", Runner: "journal/runner@sha256:abc"}

	if err := unpinned.AssertLoaded(context.Background(), Containers{Docker: "docker"}); !errors.Is(err, ErrContainedNeedsImages) {
		t.Fatalf("an image by tag gave %v", err)
	}

	want := "arrangement contained\nagent-image journal/agent@sha256:a\nrunner-image journal/runner@sha256:b"
	if got := (PinnedImages{Agent: "journal/agent@sha256:a", Runner: "journal/runner@sha256:b"}).Lines(Contained); got != want {
		t.Fatalf("the lines are %q", got)
	}
}

func TestOnlyACodexStartOnAContainedHostIsRefused(t *testing.T) {
	if err := Contained.AssertContainable("codex"); !errors.Is(err, ErrDriverNotContainable) {
		t.Fatalf("a contained Codex start gave %v", err)
	}

	for _, admitted := range []struct {
		arrangement Arrangement
		program     string
	}{{Contained, "claude-code"}, {Local, "codex"}, {Local, "claude-code"}} {
		if err := admitted.arrangement.AssertContainable(admitted.program); err != nil {
			t.Fatalf("%s on a %s host was refused: %v", admitted.program, admitted.arrangement, err)
		}
	}
}
