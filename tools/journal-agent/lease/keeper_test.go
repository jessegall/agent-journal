package lease

import (
	"context"
	"errors"
	"testing"
	"time"
)

var errRefused = errors.New("the lease is not renewed")

func TestARuntimeWhoseFirstRenewalIsRefusedStopsAtOnce(t *testing.T) {
	stopped := false
	supervisor := Supervisor{Stop: func() { stopped = true }}

	supervisor.Keep(context.Background(), func(context.Context) (time.Time, time.Time, error) {
		return time.Time{}, time.Time{}, errRefused
	}, time.Hour)

	if !stopped {
		t.Fatal("a runtime with no lease kept working")
	}
}

func TestAKeptLeaseStopsTheRuntimeOnceRenewalsFailAndItRunsOut(t *testing.T) {
	stopped := make(chan time.Time, 1)
	supervisor := Supervisor{Stop: func() { stopped <- time.Now() }}
	renewals := 0
	started := time.Now()

	go supervisor.Keep(context.Background(), func(context.Context) (time.Time, time.Time, error) {
		renewals++
		if renewals > 3 {
			return time.Time{}, time.Time{}, errRefused
		}
		server := time.Now()

		return server, server.Add(200 * time.Millisecond), nil
	}, 20*time.Millisecond)

	select {
	case at := <-stopped:
		if at.Sub(started) < 200*time.Millisecond {
			t.Fatalf("the runtime stopped inside its lease, after %s", at.Sub(started))
		}
	case <-time.After(5 * time.Second):
		t.Fatal("the runtime kept working after its renewals failed")
	}
}

func TestAKeptLeaseEndsWithItsContextWithoutStoppingTheRuntime(t *testing.T) {
	stopped := false
	supervisor := Supervisor{Stop: func() { stopped = true }}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	supervisor.Keep(ctx, func(context.Context) (time.Time, time.Time, error) {
		server := time.Now()

		return server, server.Add(time.Minute), nil
	}, time.Hour)

	if stopped {
		t.Fatal("an ended keeper stopped a runtime whose lease still held")
	}
}
