package hostapi

import (
	"context"
	"errors"
	"fmt"
	"time"

	"journal-runner/client"
)

// HeartbeatInterval is how often the host says it is alive.
const HeartbeatInterval = 30 * time.Second

// JournalCalls are the calls of host protocol 1 the relay makes to the journal.
type JournalCalls interface {
	ClaimInstruction(ctx context.Context, limit int, wait int) (ClaimedInstructions, error)
	AnswerInstruction(ctx context.Context, instruction string, body Answer) error
	NotifyInventory(ctx context.Context, body Inventory) error
	NotifyHeartbeat(ctx context.Context, body HostHeartbeat) error
}

// Relay carries host protocol 1 between the journal and the host: it claims instructions through the long poll and hands
// them to the dispatcher, sends the inventory once after the host starts and a heartbeat at every interval.
type Relay struct {
	Journal    JournalCalls
	Dispatcher *Dispatcher
	Record     *AnsweredRecord
	Table      *ProcessTable
	Release    string
	Protocol   int
	Heartbeat  time.Duration
	RetryAfter time.Duration
	// Clock is the journal's time the dispatcher's verifier judges expiry by; each claim answer sets its offset.
	Clock *JournalClock
	// Idle keeps the idle window each claim answer names, for a host that leaves when idle; nil for one that stays.
	Idle *IdleWindow
}

// Claim long-polls until the context ends; a journal that does not take protocol 1 stops it with that refusal.
func (relay Relay) Claim(ctx context.Context) error {
	for ctx.Err() == nil {
		claimed, err := relay.Journal.ClaimInstruction(ctx, ClaimInstructionLimit, ClaimInstructionWaitLimit)
		if errors.Is(err, client.ErrProtocolRefused) {
			return err
		}
		if err != nil {
			relay.pause(ctx)
			continue
		}
		relay.Clock.Observe(claimed.Now)
		relay.Idle.Observe(claimed.IdleWindowSeconds)
		for _, instruction := range claimed.Instructions {
			relay.Dispatcher.submitAt(ctx, instruction, claimed.Now)
		}
	}
	return ctx.Err()
}

// SendInventory tells the journal what the host holds now, every container of its installation on the daemon and the
// newest instruction it answered. A daemon that cannot be asked leaves the containers out, and the inventory is still
// sent, so the journal still settles the processes.
func (relay Relay) SendInventory(ctx context.Context) error {
	containers, listed := relay.Table.InstallationContainers(ctx)
	if listed != nil {
		listed = fmt.Errorf("the inventory names no containers, as the daemon could not list them: %w", listed)
	}
	protocol := relay.Protocol
	if protocol == 0 {
		protocol = ProtocolVersion
	}
	sent := relay.Journal.NotifyInventory(ctx, Inventory{
		Protocol:        protocol,
		Release:         relay.Release,
		AnsweredThrough: relay.Record.AnsweredThrough(),
		Capabilities:    relay.Dispatcher.Capabilities(),
		Processes:       relay.Table.Inventory(),
		Containers:      containers,
	})

	return errors.Join(sent, listed)
}

// Beat sends a heartbeat at every interval until the context ends.
func (relay Relay) Beat(ctx context.Context) {
	ticker := time.NewTicker(relay.Heartbeat)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			_ = relay.Journal.NotifyHeartbeat(ctx, HostHeartbeat{
				LiveProcesses:   relay.Table.Live(),
				AnsweredThrough: relay.Record.AnsweredThrough(),
			})
		}
	}
}

func (relay Relay) pause(ctx context.Context) {
	select {
	case <-ctx.Done():
	case <-time.After(relay.RetryAfter):
	}
}
