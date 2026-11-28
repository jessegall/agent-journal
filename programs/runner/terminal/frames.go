package terminal

import (
	"context"
	"time"

	"journal-runner/hostapi"
)

type frameStream struct {
	stop    context.CancelFunc
	changed chan struct{}
}

// settleTime lets one terminal redraw complete before sending a frame.
const settleTime = 15 * time.Millisecond

func (session *Session) Snapshot() (hostapi.Empty, error) {
	session.output.Lock()
	defer session.output.Unlock()
	if session.privateEntry != nil || session.waitForRedraw {
		return hostapi.Empty{}, nil
	}
	frame := session.screen.Frame(session.monotonic())
	return hostapi.Empty{}, session.post(hostapi.Output{Frames: []hostapi.Frame{frame}})
}

// Stream sends a frame at the requested rate even if the screen stayed still. Zero ends the stream.
func (session *Session) Stream(plan hostapi.StreamPlan) (hostapi.Empty, error) {
	session.output.Lock()
	defer session.output.Unlock()
	if session.stream.stop != nil {
		session.stream.stop()
		session.stream = frameStream{}
	}
	if plan.FramesPerSecond > 0 {
		ctx, stop := context.WithCancel(context.Background())
		session.stream = frameStream{stop: stop, changed: make(chan struct{}, 1)}
		interval := max(time.Nanosecond, time.Second/time.Duration(plan.FramesPerSecond))
		go session.streamFrames(ctx, session.stream.changed, interval)
	}
	return hostapi.Empty{}, nil
}

func (session *Session) streamFrames(ctx context.Context, changed <-chan struct{}, interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	settled := time.NewTimer(time.Hour)
	settled.Stop()
	defer settled.Stop()
	lastChangeSent := time.Time{}
	send := func() {
		_, _ = session.Snapshot()
		ticker.Reset(interval)
	}
	for {
		select {
		case <-ctx.Done():
			return
		case <-changed:
			settled.Reset(max(settleTime, interval-time.Since(lastChangeSent)))
		case <-settled.C:
			lastChangeSent = time.Now()
			send()
		case <-ticker.C:
			send()
		}
	}
}

func (session *Session) screenChanged() {
	if session.stream.changed == nil {
		return
	}
	select {
	case session.stream.changed <- struct{}{}:
	default:
	}
}
