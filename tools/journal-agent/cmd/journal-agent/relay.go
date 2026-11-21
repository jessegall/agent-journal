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
// presence beside it, until the idle window passes the last claim that handed work, the folder's binding state is
// gone or ctx ends.
func (binder bindingRelay) run(ctx context.Context) error {
	unlock, err := binder.state.LockRelay()
	if err != nil {
		return err
	}
	defer unlock()

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
	served := make(chan error, 1)
	go func() {
		served <- binder.serveClaims(serving, journal, leases, func() { lastWork.Store(time.Now().UnixNano()) })
	}()

	idleEnds := func() time.Time { return time.Unix(0, lastWork.Load()).Add(binder.idle) }
	for sequence := 1; ctx.Err() == nil && time.Now().Before(idleEnds()); sequence++ {
		receipt, err := journal.ReportPresence(ctx, binder.binding.BindingID, client.PresenceReport{
			BootID: bootID, Sequence: sequence, Release: binder.release,
			Protocol: client.RemoteProjectProtocolVersion, Combinations: []client.HostCombination{},
			Provisioning: "succeeded", Takeover: sequence == 1,
		})
		if err == nil {
			leases.authority.Store(int64(receipt.AuthorityGeneration))
		}
		if !binder.wait(ctx, binder.nextReport(receipt, err, bootID)) {
			break
		}
		// A disconnected folder's state is gone: the relay stops at once rather than at its idle window.
		if _, err := binder.state.Binding(); err != nil {
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
	claimed func(),
) error {
	folder := filepath.Join(binder.state.Folder, "relays", binder.binding.BindingID)
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
		declared:   combinationsOf(host.Local),
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
	open := leases.opening(ctx, opener.open)
	executor := &protectedExecutor{preparation: preparation, open: open, reports: reports, reporter: journal,
		codexOwners: opener.codexOwners, arrangement: host.Local}
	claims := claimServing{journal: journal, preparation: preparation, open: open, executor: executor,
		startSocketFolder: folder, socket: socket}

	return claims.run(ctx, claimed)
}

// nextReport keeps an acknowledged report and answers how long to wait before the next: half the time the
// presence has left, or a short retry after a report the journal did not take.
func (binder bindingRelay) nextReport(receipt client.PresenceReceipt, failure error, bootID string) time.Duration {
	if failure != nil {
		log.Printf("the presence report of binding %s failed: %v", binder.binding.BindingID, failure)
		return relayRetry
	}
	report := host.RelayReport{
		BootID: bootID, Generation: receipt.Generation, ReportedAt: time.Now(), ExpiresAt: receipt.ExpiresAt,
	}
	if err := binder.state.SaveRelayReport(report); err != nil {
		log.Printf("the presence report of binding %s was not kept: %v", binder.binding.BindingID, err)
	}

	return max(time.Until(receipt.ExpiresAt)/2, time.Second)
}

// wait sleeps for the duration and answers whether the relay goes on.
func (binder bindingRelay) wait(ctx context.Context, duration time.Duration) bool {
	select {
	case <-ctx.Done():
		return false
	case <-time.After(duration):
		return true
	}
}

// awaitReady waits, at most the given time, for an acknowledged report whose presence has not expired.
func awaitReady(state host.ConnectionState, within time.Duration) bool {
	deadline := time.Now().Add(within)
	for time.Now().Before(deadline) {
		if report, err := state.RelayReport(); err == nil && report.ExpiresAt.After(time.Now()) {
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
