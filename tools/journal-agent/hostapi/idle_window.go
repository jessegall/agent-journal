package hostapi

import (
	"sync/atomic"
	"time"
)

// IdleWindow is how long a host that holds no live process stays online, as the journal's last claim answer named it;
// unknown until the first answer, when the host stays.
type IdleWindow struct {
	seconds atomic.Int64
}

// Observe keeps the window a claim answer named; a host with no window, such as an enrolled host, keeps none.
func (window *IdleWindow) Observe(seconds int) {
	if window == nil {
		return
	}
	window.seconds.Store(int64(seconds))
}

// HasPassedSince answers whether the window the journal named has passed since the host last held work.
func (window *IdleWindow) HasPassedSince(lastWork time.Time) bool {
	seconds := window.seconds.Load()

	return seconds > 0 && time.Now().After(lastWork.Add(time.Duration(seconds)*time.Second))
}
