package hostapi

import (
	"sync/atomic"
	"time"
)

// JournalClock is the journal's time as the host reckons it: its own clock moved by the offset the last claim
// answer showed, so an order's expiry holds on a host whose clock runs slow or fast.
type JournalClock struct {
	Host   func() time.Time
	offset atomic.Int64
}

// Observe takes the journal's time a claim answer carried, on receipt.
func (clock *JournalClock) Observe(journalNow time.Time) {
	if journalNow.IsZero() {
		return
	}
	clock.offset.Store(int64(journalNow.Sub(clock.Host())))
}

// Now is the journal's time now.
func (clock *JournalClock) Now() time.Time {
	return clock.Host().Add(time.Duration(clock.offset.Load()))
}
