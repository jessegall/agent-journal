package main

import (
	"context"
	"log"
	"sync/atomic"
	"time"

	"journal-agent/client"
	"journal-agent/diagnostics"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/lease"
	"journal-agent/serving"
)

// relayLeases keeps the execution lease of every runtime a binding's relay opens, under the binding's latest
// authority generation, stops a runtime whose lease ends and records each step in the binding's diagnostics.
type relayLeases struct {
	journal   *client.Client
	bindingID string
	events    diagnostics.Log
	// authority is the binding's authority generation from the latest presence receipt.
	authority atomic.Int64
}

// opening wraps an opener so every runtime it opens keeps its lease until ctx ends or the lease does.
func (leases *relayLeases) opening(ctx context.Context, open serving.Opener) serving.Opener {
	return func(runtimeID string, prepared host.PreparedStart) (serving.Runtime, error) {
		runtime, err := open(runtimeID, prepared)
		if err != nil {
			leases.record(diagnostics.Event{Step: "runtime not opened", RuntimeID: runtimeID,
				ClaimID: prepared.Claim.StartKey, Side: diagnostics.Local, Failure: err.Error()})
			return nil, err
		}
		leases.record(diagnostics.Event{Step: "runtime opened", RuntimeID: runtimeID, ClaimID: prepared.Claim.StartKey})
		go leases.keep(ctx, runtimeID, runtime)

		return runtime, nil
	}
}

// keep renews the runtime's lease and stops the runtime once it ends; a stopped runtime's lease is refused, which
// ends the keeping.
func (leases *relayLeases) keep(ctx context.Context, runtimeID string, runtime serving.Runtime) {
	var refusal error
	supervisor := lease.Supervisor{Stop: func() {
		leases.record(diagnostics.Event{Step: "lease ended", RuntimeID: runtimeID, Side: diagnostics.Server,
			Failure: failureOf(refusal)})
		stop := contracts.StopRequest{Request: contracts.RequestIdentity{RuntimeID: runtimeID, RequestID: "lease-" + runtimeID}}
		if _, err := runtime.Stop(context.Background(), stop); err != nil {
			log.Printf("runtime %s did not stop when its lease ended: %v", runtimeID, err)
		}
	}}
	supervisor.Keep(ctx, func(ctx context.Context) (time.Time, time.Time, error) {
		renewal := client.LeaseRenewal{
			AuthorityGeneration: int(leases.authority.Load()),
			RuntimeGeneration:   runtime.Generation(),
		}
		answer, err := leases.journal.RenewLease(ctx, leases.bindingID, runtimeID, renewal)
		refusal = err

		return answer.ServerTime, answer.ExpiresAt, err
	}, lease.RenewEvery)
}

// record keeps the event in the binding's diagnostics; a log that cannot be written never stops the relay.
func (leases *relayLeases) record(event diagnostics.Event) {
	event.At = time.Now()
	if err := leases.events.Record(event); err != nil {
		log.Printf("binding %s could not record %q in its diagnostics: %v", leases.bindingID, event.Step, err)
	}
}

// failureOf is the refusal's words for the diagnostics, or a lease that ran out between renewals.
func failureOf(refusal error) string {
	if refusal == nil {
		return "the lease ran out before its next renewal"
	}

	return refusal.Error()
}
