package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"time"

	"journal-runner/client"
	"journal-runner/device"
	"journal-runner/hostapi"
	"journal-runner/lease"
	"journal-runner/terminal"
)

// openMainRuntime asks the journal for the binding's main runtime under a start id kept before asking: the id of a
// start whose answer never came, else a new one. A lost answer is asked for again under the same id, which the
// journal answers with the runtime it opened, never a second one.
func openMainRuntime(
	journal *client.Client,
	state device.ConnectionState,
	request client.BindingRuntimeRequest,
	bindingID string,
) (client.OpenedBindingRuntime, error) {
	start, err := state.PendingMainStart()
	if errors.Is(err, device.ErrNotConnected) {
		startID, keyErr := device.NewRequestKey()
		if keyErr != nil {
			return client.OpenedBindingRuntime{}, keyErr
		}
		start, err = device.MainStart{StartID: startID}, state.SaveMainStart(device.MainStart{StartID: startID})
	}
	if err != nil {
		return client.OpenedBindingRuntime{}, err
	}
	request.StartID = start.StartID

	opened, err := journal.OpenBindingRuntime(context.Background(), bindingID, request)
	if errors.Is(err, client.ErrUncertain) {
		opened, err = journal.OpenBindingRuntime(context.Background(), bindingID, request)
	}
	if err != nil {
		return client.OpenedBindingRuntime{}, err
	}
	start.RuntimeID = opened.RuntimeID

	return opened, state.SaveMainStart(start)
}

// confirmStop keeps the ended session's stop receipt and sends it; a journal out of reach gets it from the relay
// once the device is back, so the session reads stopped there once.
func confirmStop(journal *client.Client, state device.ConnectionState, bindingID, runtimeID string, stderr io.Writer) {
	if err := state.QueueStopReceipt(runtimeID); err != nil {
		fmt.Fprintln(stderr, "journal-terminal: the session's stop could not be kept for the journal:", err)
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := state.SendStopReceipts(ctx, bindingID, journal); err != nil {
		fmt.Fprintln(stderr, "journal-terminal: the journal has not confirmed the session stopped yet; this machine tells it once it is back.")
	}
}

// firstProcessGeneration is the process generation of a runtime the journal just opened.
const firstProcessGeneration = 1

// leaseStopGrace is how long a session whose lease ended has to end its own tools before it is killed.
const leaseStopGrace = 5 * time.Second

// superviseSession keeps the session's execution lease; once it ends, the hook gate closes, so no tool call of the
// session is answered again, and its program is asked to stop, then killed after a grace.
func superviseSession(
	ctx context.Context,
	journal *client.Client,
	bindingID string,
	opened client.OpenedBindingRuntime,
	gate io.Closer,
	session *terminal.Session,
	stderr io.Writer,
) {
	supervisor := lease.Supervisor{Stop: func() {
		fmt.Fprintln(stderr, "journal-terminal: the journal no longer lets this session work, so it stops. Your files stay as they are.")
		gate.Close()
		_, _ = session.Stop(stopPlan())
	}}
	renewal := client.LeaseRenewal{AuthorityGeneration: opened.AuthorityGeneration, RuntimeGeneration: firstProcessGeneration}
	supervisor.Keep(ctx, func(ctx context.Context) (time.Time, time.Time, error) {
		answer, err := journal.RenewLease(ctx, bindingID, opened.RuntimeID, renewal)

		return answer.ServerTime, answer.ExpiresAt, err
	}, lease.RenewEvery)
}

func stopPlan() hostapi.StopPlan {
	return hostapi.StopPlan{GraceMs: int(leaseStopGrace.Milliseconds()), ForceMs: 1000}
}
