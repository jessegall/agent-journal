package host

import (
	"context"
	"errors"
	"log"
	"time"

	"journal-agent/client"
)

// beatInterval keeps beats well inside the journal's 60-second freshness bound.
const beatInterval = 30 * time.Second

// HeartbeatEvidence says whether the host still holds current evidence that a runtime lives, and in which generation:
// for a process runtime between turns, the supervised runtime and its resume state; for a terminal runtime, its live
// owned program.
type HeartbeatEvidence interface {
	IsCurrent() bool
	ProcessGeneration() int
	Description() string
}

// HeartbeatSender reports one runtime's liveness through the host's signed client: once at once, then every 30
// seconds while the evidence holds. It stops when the evidence ends or the journal refuses a beat (a revoked or ended
// session); a beat the journal could not be reached for is tried again at the next interval.
type HeartbeatSender struct {
	Client    *client.Client
	RuntimeID string
	Evidence  HeartbeatEvidence
	interval  time.Duration
}

// Run sends beats until ctx ends, the evidence ends, or a beat is refused.
func (sender HeartbeatSender) Run(ctx context.Context) {
	interval := sender.interval
	if interval == 0 {
		interval = beatInterval
	}
	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	for sender.Evidence.IsCurrent() {
		err := sender.Client.ReportHeartbeat(ctx, client.LivenessReport{
			RuntimeID:         sender.RuntimeID,
			ProcessGeneration: sender.Evidence.ProcessGeneration(),
			Evidence:          sender.Evidence.Description(),
		})
		if errors.Is(err, client.ErrRefused) {
			log.Printf("heartbeat of runtime %s refused, stopping: %v", sender.RuntimeID, err)
			return
		}
		if err != nil {
			log.Printf("heartbeat of runtime %s not delivered, trying again: %v", sender.RuntimeID, err)
		}
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
		}
	}
}
