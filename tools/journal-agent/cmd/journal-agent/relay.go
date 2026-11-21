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
	"syscall"
	"time"

	"journal-agent/client"
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
		state:     state,
		binding:   binding,
		release:   filepath.Base(installation.Folder),
		transport: &http.Client{Timeout: 30 * time.Second},
		idle:      relayIdleWindow,
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
	state     host.ConnectionState
	binding   host.Binding
	release   string
	transport *http.Client
	idle      time.Duration
}

// run reports presence until the idle window ends or ctx does. Phase 4 extends the window for attached sessions and
// claims; until then nothing extends it.
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
	journal := client.ForRemoteProject(binder.binding.Enrollment, binder.transport)
	idleEnds := time.Now().Add(binder.idle)
	for sequence := 1; ctx.Err() == nil && time.Now().Before(idleEnds); sequence++ {
		receipt, err := journal.ReportPresence(ctx, binder.binding.BindingID, client.PresenceReport{
			BootID: bootID, Sequence: sequence, Release: binder.release,
			Protocol: client.RemoteProjectProtocolVersion, Combinations: []client.HostCombination{},
			Provisioning: "succeeded", Takeover: sequence == 1,
		})
		if !binder.wait(ctx, binder.nextReport(receipt, err, bootID)) {
			break
		}
		// A disconnected folder's state is gone: the relay stops at once rather than at its idle window.
		if _, err := binder.state.Binding(); err != nil {
			break
		}
	}

	return nil
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
