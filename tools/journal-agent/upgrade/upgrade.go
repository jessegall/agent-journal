// Package upgrade moves one binding to a new journal-agent release while its sessions keep running on the old one:
// the new release is verified into its own immutable folder, the binding drains, and under the binding's relay lock
// its release pointer switches atomically, one new relay starts and readiness is awaited; on failed readiness the
// pointer switches back under the same lock. Another binding keeps its own release.
package upgrade

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"time"

	"journal-agent/host"
)

// ErrNotReady is returned when the new release's relay did not report ready; the old release is back in place.
var ErrNotReady = errors.New("the new release did not become ready, so the binding is back on its old release")

// Binding is the release state of one binding: which installation its relay runs from, and whether it drains.
type Binding struct {
	State host.ConnectionState
}

// Release is the installation folder the binding's relay runs from; empty before any upgrade.
func (binding Binding) Release() string {
	content, err := os.ReadFile(binding.pointer())
	if err != nil {
		return ""
	}

	return strings.TrimSpace(string(content))
}

// IsDraining is whether the binding refuses new starts while an upgrade waits for its last runtime.
func (binding Binding) IsDraining() bool {
	_, err := os.Stat(binding.drainMark())

	return err == nil
}

// Steps are what an upgrade needs from the machine: installing the verified release, counting the runtimes that
// still run, starting a relay from an installation and waiting for its first ready report.
type Steps struct {
	Install      func(folder string) error
	LiveRuntimes func() int
	StartRelay   func(installation string) error
	AwaitReady   func(within time.Duration) bool
	ReadyWithin  time.Duration
	PollInterval time.Duration
}

// Upgrade installs the new release into its folder, drains the binding until no runtime runs, then switches under
// the relay lock; a restart before the switch finds the old pointer, after it the new one.
func (binding Binding) Upgrade(newRelease string, steps Steps) error {
	if err := steps.Install(newRelease); err != nil {
		return err
	}
	if err := host.WritePrivateFile(binding.drainMark(), []byte("draining\n")); err != nil {
		return err
	}
	defer os.Remove(binding.drainMark())

	for steps.LiveRuntimes() > 0 {
		time.Sleep(steps.PollInterval)
	}

	unlock, err := waitForRelayLock(binding.State, steps.PollInterval)
	if err != nil {
		return err
	}
	old := binding.Release()
	if err := host.WritePrivateFile(binding.pointer(), []byte(newRelease+"\n")); err != nil {
		unlock()
		return err
	}
	unlock()

	if err := steps.StartRelay(newRelease); err == nil && steps.AwaitReady(steps.ReadyWithin) {
		return nil
	}

	unlock, err = waitForRelayLock(binding.State, steps.PollInterval)
	if err != nil {
		return err
	}
	defer unlock()
	if err := host.WritePrivateFile(binding.pointer(), []byte(old+"\n")); err != nil {
		return err
	}

	return ErrNotReady
}

// waitForRelayLock takes the binding's relay lock once the running relay let it go, so no two relays take claims
// during a handoff.
func waitForRelayLock(state host.ConnectionState, interval time.Duration) (func(), error) {
	for {
		unlock, err := state.LockRelay()
		if err == nil {
			return unlock, nil
		}
		if !errors.Is(err, host.ErrRelayRunning) {
			return nil, err
		}
		time.Sleep(interval)
	}
}

func (binding Binding) pointer() string {
	return filepath.Join(binding.State.Folder, "releases", "binding-"+binding.bindingKey())
}

func (binding Binding) drainMark() string {
	return filepath.Join(binding.State.Folder, "releases", "binding-"+binding.bindingKey()+".draining")
}

func (binding Binding) bindingKey() string {
	return strings.NewReplacer("/", "-", " ", "-").Replace(binding.State.CanonicalRoot)
}
