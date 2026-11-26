package upgrade

import (
	"errors"
	"testing"
	"time"

	"journal-agent/host"
)

func binding(t *testing.T) Binding {
	t.Helper()
	root := t.TempDir()
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: root}
	if err := state.SaveBinding(host.Binding{BindingID: "binding-1", CanonicalRoot: root}); err != nil {
		t.Fatal(err)
	}
	return Binding{State: state}
}

func steps(ready bool, started *[]string) Steps {
	return Steps{
		Install:      func(string) error { return nil },
		LiveRuntimes: func() int { return 0 },
		StartRelay: func(installation string) error {
			*started = append(*started, installation)
			return nil
		},
		AwaitReady:   func(time.Duration) bool { return ready },
		ReadyWithin:  time.Second,
		PollInterval: 10 * time.Millisecond,
	}
}

func TestAReadyReleaseStaysTheBindingsRelease(t *testing.T) {
	upgraded := binding(t)
	started := []string{}

	if err := upgraded.Upgrade("/releases/6.1.0", steps(true, &started)); err != nil {
		t.Fatal(err)
	}

	if upgraded.Release() != "/releases/6.1.0" || len(started) != 1 || upgraded.IsDraining() {
		t.Fatalf("release %q, relays started %v, draining %v", upgraded.Release(), started, upgraded.IsDraining())
	}
}

func TestAReleaseThatNeverReportsReadyIsSwitchedBack(t *testing.T) {
	upgraded := binding(t)
	started := []string{}
	if err := upgraded.Upgrade("/releases/6.0.0", steps(true, &started)); err != nil {
		t.Fatal(err)
	}

	err := upgraded.Upgrade("/releases/6.1.0", steps(false, &started))

	if !errors.Is(err, ErrNotReady) || upgraded.Release() != "/releases/6.0.0" {
		t.Fatalf("the failed switch answered %v and left the binding on %q", err, upgraded.Release())
	}
}
