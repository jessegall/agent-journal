package terminal

import "sync"

// CaptureSink is one place a program's output can leave the host or be kept: a local mirror, the screen watcher, a
// recorder. Suppress stops it and says whether it confirmed that nothing more leaves through it.
type CaptureSink interface {
	Suppress() bool
}

// CaptureSinkFunc is a sink given as its suppression alone.
type CaptureSinkFunc func() bool

// Suppress stops the sink.
func (suppress CaptureSinkFunc) Suppress() bool { return suppress() }

// CaptureBarrier is one runtime's barrier before private entry: every output sink registers with it, Close asks each
// to stop and answers ready only when every one confirmed, and a sink that registers after it closed is stopped at
// once. Every sink consults IsClosed before it emits anything.
type CaptureBarrier struct {
	mutex  sync.Mutex
	sinks  map[string]CaptureSink
	closed bool
	// confirmed is whether the last Close had every sink confirm its suppression.
	confirmed bool
}

// NewCaptureBarrier is an open barrier with no sinks yet.
func NewCaptureBarrier() *CaptureBarrier {
	return &CaptureBarrier{sinks: map[string]CaptureSink{}}
}

// Register adds a sink under its name, replacing one of the same name; on a closed barrier it is stopped at once.
func (barrier *CaptureBarrier) Register(name string, sink CaptureSink) {
	barrier.mutex.Lock()
	defer barrier.mutex.Unlock()

	barrier.sinks[name] = sink
	if barrier.closed && !sink.Suppress() {
		barrier.confirmed = false
	}
}

// Close shuts the barrier: from now on every sink emits nothing, and each is asked to confirm its suppression. It
// answers ready only when every registered sink confirmed; a barrier that is not ready never offers private entry.
func (barrier *CaptureBarrier) Close() bool {
	barrier.mutex.Lock()
	defer barrier.mutex.Unlock()

	barrier.closed = true
	barrier.confirmed = true
	for _, sink := range barrier.sinks {
		if !sink.Suppress() {
			barrier.confirmed = false
		}
	}

	return barrier.confirmed
}

// IsClosed is whether output must not leave through any sink now.
func (barrier *CaptureBarrier) IsClosed() bool {
	barrier.mutex.Lock()
	defer barrier.mutex.Unlock()

	return barrier.closed
}

// IsReady is whether the barrier is closed with every sink's suppression confirmed.
func (barrier *CaptureBarrier) IsReady() bool {
	barrier.mutex.Lock()
	defer barrier.mutex.Unlock()

	return barrier.closed && barrier.confirmed
}
