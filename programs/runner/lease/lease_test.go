package lease

import (
	"context"
	"errors"
	"testing"
	"time"
)

// A lease lasts what the server left from its own time, counted from when the renewal request started, so a slow
// answer or a wall clock that jumped never lengthens it.
func TestALeaseLastsWhatTheServerLeftCountedFromTheRequest(t *testing.T) {
	started := time.Now()
	serverTime := time.Date(2026, 11, 26, 12, 0, 0, 0, time.UTC)
	lease := Renewed(started, serverTime, serverTime.Add(time.Minute))

	if lease.IsExpired(started.Add(59*time.Second)) || !lease.IsExpired(started.Add(time.Minute)) {
		t.Fatal("the lease does not end a minute after its request started")
	}
	if !lease.IsExpired(started.Add(-time.Second)) || !(Lease{}).IsExpired(started) {
		t.Fatal("a clock that runs backwards, or no renewal at all, must count as expired")
	}
	if past := Renewed(started, serverTime, serverTime.Add(-time.Minute)); !past.IsExpired(started) {
		t.Fatal("an expiry before the server's time gives no time at all")
	}
}

// A runtime whose first renewal fails is stopped at once, and a runtime whose renewals stop succeeding is stopped
// once its last lease ended; a failed renewal never extends it.
func TestARuntimeIsStoppedWhenItsLeaseEndsAndAFailedRenewalNeverExtendsIt(t *testing.T) {
	refused := func(context.Context) (time.Time, time.Time, error) {
		return time.Time{}, time.Time{}, errors.New("refused")
	}
	stopped := 0
	supervisor := &Supervisor{Stop: func() { stopped++ }}
	supervisor.Keep(context.Background(), refused, time.Hour)
	if stopped != 1 {
		t.Fatalf("a runtime without a first lease ran on: stopped %d times", stopped)
	}

	renewals := 0
	shortLease := func(context.Context) (time.Time, time.Time, error) {
		renewals++
		if renewals > 1 {
			return time.Time{}, time.Time{}, errors.New("refused")
		}
		now := time.Now()

		return now, now.Add(1500 * time.Millisecond), nil
	}
	stopped = 0
	ended := make(chan struct{})
	go func() {
		supervisor.Keep(context.Background(), shortLease, 100*time.Millisecond)
		close(ended)
	}()

	select {
	case <-ended:
	case <-time.After(5 * time.Second):
		t.Fatal("the runtime was not stopped once its lease ended")
	}
	if stopped != 1 || renewals < 2 {
		t.Fatalf("stopped %d times after %d renewals", stopped, renewals)
	}
}
