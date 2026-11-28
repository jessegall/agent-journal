package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"sync/atomic"
	"syscall"
	"time"

	"journal-runner/client"
	"journal-runner/device"
	"journal-runner/host"
	"journal-runner/hostapi"
	"journal-runner/project"
)

const (
	// relayReadyWait is how long connect waits for the relay's first acknowledged report.
	relayReadyWait = 30 * time.Second
	// relayRetry is the wait after a report the journal did not take, before the next one.
	relayRetry = 5 * time.Second
)

// relay keeps one binding online: it holds the binding's relay lock, reports presence with a new boot and a rising
// sequence, and refreshes it before it expires, until its idle window ends.
func relay(arguments []string) error {
	flags := flag.NewFlagSet("relay", flag.ContinueOnError)
	bindingID := flags.String("binding", "", "the binding to keep online")
	stateFolder := flags.String("state", device.DefaultStateFolder(), "the host's private state folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	state, binding, err := device.ConnectionOfBinding(*stateFolder, *bindingID)
	if err != nil {
		return err
	}
	if state.IsFenced() {
		log.Printf("binding %s is being disconnected, so its relay does not start", binding.BindingID)
		return nil
	}
	installation, err := ownInstallation()
	if err != nil {
		return err
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	binder := bindingRelay{
		state:        state,
		binding:      binding,
		installation: installation,
		release:      filepath.Base(installation.Folder),
		transport:    &http.Client{Timeout: 30 * time.Second},
		idle:         &hostapi.IdleWindow{},
	}
	err = binder.run(ctx)
	if errors.Is(err, device.ErrRelayRunning) {
		log.Printf("a relay already keeps binding %s online", binding.BindingID)
		return nil
	}

	return err
}

// bindingRelay is the relay of one binding.
type bindingRelay struct {
	state        device.ConnectionState
	binding      device.Binding
	installation host.Installation
	release      string
	transport    *http.Client
	idle         *hostapi.IdleWindow
}

// run holds the binding's relay lock for the whole run, carries out the instructions the journal sends this binding's host
// and reports presence beside it, until the idle window passes with no live process, a disconnect fences the folder,
// the folder's binding state is gone or ctx ends. The lock is let go only once serving ended.
func (binder bindingRelay) run(parent context.Context) error {
	unlock, err := binder.state.LockRelay()
	if err != nil {
		return err
	}
	defer unlock()
	ctx, stopAtFence := context.WithCancel(parent)
	defer stopAtFence()
	go binder.watchFence(ctx, stopAtFence)

	bootID, err := newBootID()
	if err != nil {
		return err
	}
	journal := client.ForRemoteProject(binder.binding.Enrollment, binder.transport)
	serving, stopServing := context.WithCancel(ctx)
	defer stopServing()
	table, err := binder.serveInstructions(serving, journal, stopAtFence)
	if err != nil {
		return err
	}
	reconciliation := &bootReconciliation{done: make(chan struct{})}
	go binder.finishReconciliation(ctx, journal, reconciliation)

	lastWork := time.Now()
	for sequence := 1; ctx.Err() == nil; sequence++ {
		// A relay that holds a live process is never idle.
		if len(table.Live()) > 0 {
			lastWork = time.Now()
		}
		if binder.idle.HasPassedSince(lastWork) {
			break
		}
		receipt, err := journal.NotifyPresence(ctx, binder.binding.BindingID, client.PresenceReport{
			BootID: bootID, Sequence: sequence, Release: binder.release,
			Provisioning: "succeeded", IsTakeover: sequence == 1,
			SetupGeneration: project.Folder{Root: binder.binding.CanonicalRoot}.SetupGeneration(),
			IsReconciled:    reconciliation.reportNow(),
		})
		if !binder.wait(ctx, binder.nextReport(receipt, err, bootID), reconciliation.reported()) {
			break
		}
	}

	return nil
}

// serveInstructions runs the relay protocol for this binding alone, local and uncontained, from a folder of its own beside the
// binding's state, so two bindings' relays never share a process table; the journal opens and drives every process
// and reads the folder by instructions.
func (binder bindingRelay) serveInstructions(
	ctx context.Context, journal *client.Client, stop func(),
) (*hostapi.ProcessTable, error) {
	folder := device.RelayFolder(binder.state.Folder, binder.binding.BindingID)
	if err := os.MkdirAll(folder, 0o700); err != nil {
		return nil, err
	}
	reads := hostapi.ProjectReads{
		Reader:  host.ProjectReader{Root: binder.binding.CanonicalRoot},
		Journal: hostapi.Journal{Client: journal},
	}

	var table atomic.Pointer[hostapi.ProcessTable]
	live := func() []string {
		if held := table.Load(); held != nil {
			return held.Live()
		}
		return []string{}
	}
	upgrade := bindingUpgrade{binder: binder, live: live, stop: stop}
	// A connected host opens only the programs its installer sealed, by the names the installer gave them.
	allowed, err := hostapi.LoadAllowedPrograms(binder.state.Folder, filepath.Base(binder.installation.Folder))
	if err != nil {
		return nil, err
	}
	names := device.InstalledPlanNames(journal.JournalURL(), binder.installation.Folder, allowed.Programs)
	started, err := startHostProtocol(ctx, journal, binder.binding.Enrollment, folder, names, host.Containers{},
		binder.release, hostProtocolOptions{
			Protocol: hostapi.RelayProtocolVersion, Reads: &reads, Upgrade: &upgrade, Idle: binder.idle, Allowed: allowed,
		})
	if err != nil {
		return nil, err
	}
	table.Store(started)

	return started, nil
}

// fenceCheck is how often a running relay looks whether a disconnect fenced its folder.
const fenceCheck = 250 * time.Millisecond

// watchFence ends the relay's run once a disconnect fenced the folder or its binding state is gone, so it admits no
// new work and lets go of its lock for the disconnect waiting on it.
func (binder bindingRelay) watchFence(ctx context.Context, stop context.CancelFunc) {
	ticker := time.NewTicker(fenceCheck)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		}
		if _, err := binder.state.Binding(); binder.state.IsFenced() || err != nil {
			stop()
			return
		}
	}
}

// finishReconciliation sends the session stops kept while the device was away and marks the boot reconciled once
// they are taken; the inventory the host protocol sent at its start reported every process it still holds.
func (binder bindingRelay) finishReconciliation(
	ctx context.Context,
	journal *client.Client,
	reconciliation *bootReconciliation,
) {
	for ctx.Err() == nil {
		err := binder.state.SendStopReceipts(ctx, binder.binding.BindingID, journal)
		if err == nil {
			reconciliation.finish()
			return
		}
		log.Printf("session stops of binding %s wait for the journal: %v", binder.binding.BindingID, err)
		if !binder.wait(ctx, relayRetry, nil) {
			return
		}
	}
}

// nextReport keeps an acknowledged report and answers how long to wait before the next: half the time the
// presence has left, or a short retry after a report the journal did not take.
func (binder bindingRelay) nextReport(receipt client.PresenceReceipt, failure error, bootID string) time.Duration {
	if errors.Is(failure, client.ErrUnauthenticated) || errors.Is(failure, client.ErrRefused) {
		log.Printf("this machine lost access to binding %s; only the journal says whether it was revoked: %v",
			binder.binding.BindingID, failure)
		return relayRetry
	}
	if failure != nil {
		log.Printf("the presence report of binding %s failed: %v", binder.binding.BindingID, failure)
		return relayRetry
	}
	report := device.RelayReport{
		BindingID: receipt.BindingID, BootID: bootID, Generation: receipt.Generation,
		SetupGeneration: receipt.SetupGeneration, ReportedAt: time.Now(), AcknowledgedAt: receipt.ServerTime,
		ExpiresAt: receipt.ExpiresAt, Readiness: receipt.Readiness,
	}
	if err := binder.state.SaveRelayReport(report); err != nil {
		log.Printf("the presence report of binding %s was not kept: %v", binder.binding.BindingID, err)
	}

	return max(time.Until(receipt.ExpiresAt)/2, time.Second)
}

// wait sleeps for the duration, or until the boot's reconciliation ends so the journal receives of it at once, and
// answers whether the relay goes on.
func (binder bindingRelay) wait(ctx context.Context, duration time.Duration, reconciled <-chan struct{}) bool {
	select {
	case <-ctx.Done():
		return false
	case <-time.After(duration):
		return true
	case <-reconciled:
		return true
	}
}

// bootReconciliation is whether this boot reported what became of its earlier sessions: the session stops kept while
// the device was away were taken.
type bootReconciliation struct {
	done      chan struct{}
	finished  atomic.Bool
	announced atomic.Bool
}

func (reconciliation *bootReconciliation) finish() {
	if reconciliation.finished.CompareAndSwap(false, true) {
		close(reconciliation.done)
	}
}

// reportNow answers whether the presence report about to go says the boot reconciled, and notes that it said so.
func (reconciliation *bootReconciliation) reportNow() bool {
	if !reconciliation.finished.Load() {
		return false
	}
	reconciliation.announced.Store(true)

	return true
}

// reported wakes a waiting presence loop once, when the reconciliation ends before any report said so; once a report
// said so, a wait sleeps its full duration.
func (reconciliation *bootReconciliation) reported() <-chan struct{} {
	if reconciliation.announced.Load() {
		return nil
	}

	return reconciliation.done
}

// awaitReady waits, at most the given time, for the journal's acknowledgement of this binding's setup generation,
// reported after this run began; a report saved before it, as after a restart, does not count.
func awaitReady(state device.ConnectionState, bindingID string, setupGeneration int, since time.Time, within time.Duration) bool {
	deadline := time.Now().Add(within)
	for time.Now().Before(deadline) {
		report, err := state.RelayReport()
		if err == nil && report.AcknowledgesSetup(bindingID, setupGeneration, since, time.Now()) {
			return true
		}
		time.Sleep(250 * time.Millisecond)
	}

	return false
}

func newBootID() (string, error) {
	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", fmt.Errorf("a boot id could not be made: %w", err)
	}

	return hex.EncodeToString(random), nil
}
