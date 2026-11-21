package upgrade

import (
	"errors"
	"testing"
	"time"

	"journal-agent/host"
)

func bindingIn(t *testing.T) Binding {
	t.Helper()
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"}
	if err := state.SaveBinding(host.Binding{BindingID: "binding-1"}); err != nil {
		t.Fatal(err)
	}

	return Binding{State: state}
}

func TestAnUpgradeWaitsForTheLastRuntimeThenSwitches(t *testing.T) {
	binding := bindingIn(t)
	live := 2
	drainedWhileLive := false
	steps := Steps{
		Install: func(string) error { return nil },
		LiveRuntimes: func() int {
			drainedWhileLive = drainedWhileLive || binding.IsDraining()
			live--
			return live
		},
		StartRelay:   func(string) error { return nil },
		AwaitReady:   func(time.Duration) bool { return true },
		PollInterval: time.Millisecond,
	}

	if err := binding.Upgrade("/releases/2.0.0", steps); err != nil {
		t.Fatal(err)
	}

	if binding.Release() != "/releases/2.0.0" || !drainedWhileLive || binding.IsDraining() {
		t.Fatalf("release %q, drained %v, still draining %v", binding.Release(), drainedWhileLive, binding.IsDraining())
	}
}

func TestAFailedReadinessSwitchesBack(t *testing.T) {
	binding := bindingIn(t)
	steps := Steps{
		Install:      func(string) error { return nil },
		LiveRuntimes: func() int { return 0 },
		StartRelay:   func(string) error { return nil },
		AwaitReady:   func(time.Duration) bool { return false },
		PollInterval: time.Millisecond,
	}
	if err := binding.Upgrade("/releases/1.0.0", Steps{
		Install: steps.Install, LiveRuntimes: steps.LiveRuntimes, StartRelay: steps.StartRelay,
		AwaitReady: func(time.Duration) bool { return true }, PollInterval: time.Millisecond,
	}); err != nil {
		t.Fatal(err)
	}

	if err := binding.Upgrade("/releases/2.0.0", steps); !errors.Is(err, ErrNotReady) {
		t.Fatalf("a failed readiness answered %v", err)
	}
	if binding.Release() != "/releases/1.0.0" {
		t.Fatalf("the binding is on %q, want the old release", binding.Release())
	}
}
