package contracts

import (
	"errors"
	"time"
)

// ErrLimitsMissing refuses a start whose grant carries no wait the driver can run on.
var ErrLimitsMissing = errors.New("the start grant names no driver limits")

// Limits are the waits and retries the journal sends with a runtime's start, in milliseconds: a driver waits only as
// long as it was told, and decides none of them itself.
type Limits struct {
	ReadyWaitMs       int `json:"ready_wait_ms"`
	EchoWaitMs        int `json:"echo_wait_ms"`
	UnsentLookMs      int `json:"unsent_look_ms"`
	UnsentEnters      int `json:"unsent_enters"`
	TurnStartWindowMs int `json:"turn_start_window_ms"`
	StrandedSettleMs  int `json:"stranded_settle_ms"`
	StopGraceMs       int `json:"stop_grace_ms"`
	StopForceMs       int `json:"stop_force_ms"`
}

// Problem refuses limits with a wait of none: a grant without them was not made by the journal.
func (limits Limits) Problem() error {
	for _, wait := range []int{
		limits.ReadyWaitMs, limits.EchoWaitMs, limits.UnsentLookMs, limits.TurnStartWindowMs,
		limits.StrandedSettleMs, limits.StopGraceMs, limits.StopForceMs,
	} {
		if wait <= 0 {
			return ErrLimitsMissing
		}
	}

	return nil
}

// ReadyWait is how long a delivery waits for an empty, still composer before it stays staged.
func (limits Limits) ReadyWait() time.Duration { return milliseconds(limits.ReadyWaitMs) }

// EchoWait is how long a typed line waits to be drawn in the composer before its delivery is uncertain.
func (limits Limits) EchoWait() time.Duration { return milliseconds(limits.EchoWaitMs) }

// UnsentLook is how long the driver watches the composer after an Enter before it takes the line as still unsent.
func (limits Limits) UnsentLook() time.Duration { return milliseconds(limits.UnsentLookMs) }

// TurnStartWindow is how long a submitted prompt waits for its turn to take the composer away.
func (limits Limits) TurnStartWindow() time.Duration { return milliseconds(limits.TurnStartWindowMs) }

// StrandedSettle is how long a driver waits for a browser take to settle its stranded line.
func (limits Limits) StrandedSettle() time.Duration { return milliseconds(limits.StrandedSettleMs) }

// StopGrace is how long a stopped program has to end after the graceful signal.
func (limits Limits) StopGrace() time.Duration { return milliseconds(limits.StopGraceMs) }

// StopForce is how long a stopped program has to end after the force signal.
func (limits Limits) StopForce() time.Duration { return milliseconds(limits.StopForceMs) }

func milliseconds(count int) time.Duration {
	return time.Duration(count) * time.Millisecond
}
