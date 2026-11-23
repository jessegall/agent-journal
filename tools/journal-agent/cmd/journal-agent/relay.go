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

	"journal-agent/client"
	"journal-agent/diagnostics"
	"journal-agent/host"
	"journal-agent/project"
)

const (
	// relayIdleWindow is how long a relay with no attached session or claim keeps its binding online.
	relayIdleWindow = 10 * time.Minute
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
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	state, binding, err := host.ConnectionOfBinding(*stateFolder, *bindingID)
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
		idle:         relayIdleWindow,
	}
	err = binder.run(ctx)
	if errors.Is(err, host.ErrRelayRunning) {
		log.Printf("a relay already keeps binding %s online", binding.BindingID)
		return nil
	}

	return err
}

// bindingRelay is the relay of one binding.
type bindingRelay struct {
	state        host.ConnectionState
	binding      host.Binding
	installation host.Installation
	release      string
	transport    *http.Client
	idle         time.Duration
}

// run holds the binding's relay lock for the whole run, serves the work the journal hands this binding and reports
// presence beside it, until the idle window passes the last claim that handed work, a disconnect fences the folder,
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
	journal := client.ForRemoteProject(binder.binding.Enrollment, binder.transport).WithArrangement(string(host.Local))
	leases := &relayLeases{journal: journal, bindingID: binder.binding.BindingID,
		events: diagnostics.Log{State: binder.state}}
	serving, stopServing := context.WithCancel(ctx)
	defer stopServing()
	var lastWork atomic.Int64
	lastWork.Store(time.Now().UnixNano())
	reconciliation := &bootReconciliation{done: make(chan struct{})}
	served := make(chan error, 1)
	go func() {
		served <- binder.serveClaims(serving, journal, leases, reconciliation,
			func() { lastWork.Store(time.Now().UnixNano()) })
	}()

	idleEnds := func() time.Time { return time.Unix(0, lastWork.Load()).Add(binder.idle) }
	for sequence := 1; ctx.Err() == nil && time.Now().Before(idleEnds()); sequence++ {
		receipt, err := journal.ReportPresence(ctx, binder.binding.BindingID, client.PresenceReport{
			BootID: bootID, Sequence: sequence, Release: binder.release,
			Descriptors:  isolatedDescriptors(),
			Provisioning: "succeeded", Takeover: sequence == 1,
			SetupGeneration: project.Folder{Root: binder.binding.CanonicalRoot}.SetupGeneration(),
			Reconciled:      reconciliation.reportNow(),
		})
		if err == nil {
			leases.authority.Store(int64(receipt.AuthorityGeneration))
		}
		if !binder.wait(ctx, binder.nextReport(receipt, err, bootID), reconciliation.reported()) {
			break
		}
	}
	stopServing()
	if err := <-served; err != nil {
		log.Printf("binding %s stopped serving its work: %v", binder.binding.BindingID, err)
	}

	return nil
}

// serveClaims runs the enrolled host's claim serving for this binding alone, local and uncontained, from a folder of
// its own beside the binding's state, so two bindings' relays never share a socket or a start record.
func (binder bindingRelay) serveClaims(
	ctx context.Context,
	journal *client.Client,
	leases *relayLeases,
	reconciliation *bootReconciliation,
	claimed func(),
) error {
	folder := host.RelayFolder(binder.state.Folder, binder.binding.BindingID)
	if err := os.MkdirAll(folder, 0o700); err != nil {
		return err
	}
	socket := &host.AttachSocket{Folder: folder, Start: startTerminal, Layout: layoutOf}
	listener, err := socket.Listen()
	if err != nil {
		return err
	}
	defer listener.Close()
	opener := runtimeOpener{stateFolder: folder, installationFolder: binder.installation.Folder,
		codexOwners: &host.CodexOwners{}, journalURL: journal.JournalURL(),
		hookCommand: filepath.Join(binder.installation.Folder, "bin", "journal-hook"), socket: socket,
		declared:   isolatedDescriptors(),
		worktrees:  &host.NativeWorktrees{Root: binder.binding.CanonicalRoot, Git: "git"},
		relayState: binder.state.Folder}
	opener.usage = host.NewUsageReports(folder)
	opener.statusLines = &host.StatusLineRelays{}
	go opener.usage.Run(ctx, journal)
	preparation := startPreparation(journal, folder, localPrerequisites(folder, binder.installation.Folder))
	reports := &host.StartReports{Folder: folder}
	outcomes, err := host.ReconcileOnBoot(ctx, journal, preparation.States, reports, host.ContainerSessions{})
	if err != nil {
		return err
	}
	for _, outcome := range outcomes {
		log.Printf("after the restart, start %s of binding %s is %s", outcome.StartKey, binder.binding.BindingID, outcome.Outcome)
		leases.record(diagnostics.Event{Step: "reconciled after the restart: " + string(outcome.Outcome),
			ClaimID: outcome.StartKey})
	}
	binder.finishReconciliation(ctx, journal, reports, reconciliation)
	open := leases.opening(ctx, opener.open)
	executor := &protectedExecutor{preparation: preparation, open: open, reports: reports, reporter: journal,
		codexOwners: opener.codexOwners, arrangement: host.Local}
	claims := claimServing{journal: journal, preparation: preparation, open: open, executor: executor,
		startSocketFolder: folder, socket: socket}

	return claims.run(ctx, claimed)
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

// finishReconciliation sends the session stops kept while the device was away and marks the boot reconciled once no
// start report or stop receipt is left unsent; otherwise the journal keeps starts and commands waiting.
func (binder bindingRelay) finishReconciliation(
	ctx context.Context,
	journal *client.Client,
	reports *host.StartReports,
	reconciliation *bootReconciliation,
) {
	if err := binder.state.SendStopReceipts(ctx, binder.binding.BindingID, journal); err != nil {
		log.Printf("session stops of binding %s wait for the journal: %v", binder.binding.BindingID, err)
		return
	}
	if unsent, err := reports.Count(); err != nil || unsent > 0 {
		log.Printf("start reports of binding %s wait for the journal", binder.binding.BindingID)
		return
	}
	reconciliation.finish()
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
	report := host.RelayReport{
		BindingID: receipt.BindingID, BootID: bootID, Generation: receipt.Generation,
		SetupGeneration: receipt.SetupGeneration, ReportedAt: time.Now(), AcknowledgedAt: receipt.ServerTime,
		ExpiresAt: receipt.ExpiresAt, Readiness: receipt.Readiness,
	}
	if err := binder.state.SaveRelayReport(report); err != nil {
		log.Printf("the presence report of binding %s was not kept: %v", binder.binding.BindingID, err)
	}

	return max(time.Until(receipt.ExpiresAt)/2, time.Second)
}

// wait sleeps for the duration, or until the boot's reconciliation ends so the journal hears of it at once, and
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

// bootReconciliation is whether this boot reported what became of its earlier sessions: the start reports and
// session stops kept while the device was away were taken, and the starts the journal counted as running compared.
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
func awaitReady(state host.ConnectionState, bindingID string, setupGeneration int, since time.Time, within time.Duration) bool {
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
