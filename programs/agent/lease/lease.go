// Package lease caps a local runtime's authority by its execution lease: the lease counts from the start of the
// latest successful renewal, by elapsed monotonic time and the server's remaining duration, so a suspended laptop
// never resumes with time it did not have; on expiry the runtime is stopped and its worktree kept.
package lease

import (
	"time"
)

// Lease is one runtime's authority as the latest successful renewal gave it.
type Lease struct {
	// renewedAt is when the renewal request started, read with its monotonic clock.
	renewedAt time.Time
	// remaining is how long the server let the runtime work from its own time.
	remaining time.Duration
}

// Renewed is the lease a successful renewal gave: started when the request started, lasting what the server left
// between its time and the expiry, never more.
func Renewed(requestStarted time.Time, serverTime time.Time, expiresAt time.Time) Lease {
	return Lease{renewedAt: requestStarted, remaining: max(expiresAt.Sub(serverTime), 0)}
}

// IsExpired is whether the lease ended by now. A wall clock that jumped, as after a sleep, cannot extend it: the
// elapsed time is read from the monotonic clock, and a clock that cannot tell counts as expired.
func (lease Lease) IsExpired(now time.Time) bool {
	if lease.renewedAt.IsZero() {
		return true
	}
	elapsed := now.Sub(lease.renewedAt)
	if elapsed < 0 {
		return true
	}

	return elapsed >= lease.remaining
}

// Supervisor stops a runtime when its lease ends; it is fed only by lease renewals, never by presence reports.
type Supervisor struct {
	lease Lease
	// Stop closes the hook gate and stops the runtime, keeping its worktree.
	Stop func()
}

// Renew keeps a successful renewal; a refused or timed-out renewal is never passed here.
func (supervisor *Supervisor) Renew(lease Lease) {
	supervisor.lease = lease
}

// Check stops the runtime once its lease has ended, and answers whether it still may work.
func (supervisor *Supervisor) Check(now time.Time) bool {
	if supervisor.lease.IsExpired(now) {
		supervisor.Stop()
		return false
	}

	return true
}
