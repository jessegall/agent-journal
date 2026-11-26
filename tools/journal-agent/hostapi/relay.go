package hostapi

import (
	"context"
	"errors"
	"time"

	"journal-agent/client"
)

// ClaimLimit is the most orders one long poll takes.
const ClaimLimit = 50

// ClaimWaitSeconds is how long one long poll waits for an order.
const ClaimWaitSeconds = 25

// HeartbeatInterval is how often the host says it is alive.
const HeartbeatInterval = 30 * time.Second

// JournalCalls are the calls of host protocol 1 the relay makes to the journal.
type JournalCalls interface {
	ClaimOrders(ctx context.Context, limit, waitSeconds int) (ClaimedOrders, error)
	AnswerOrder(ctx context.Context, answer Answer) error
	NotifyInventory(ctx context.Context, inventory Inventory) error
	NotifyHostHeartbeat(ctx context.Context, heartbeat HostHeartbeat) error
}

// Relay carries host protocol 1 between the journal and the host: it claims orders through the long poll and hands
// them to the dispatcher, sends the inventory once after the host starts and a heartbeat at every interval.
type Relay struct {
	Journal    JournalCalls
	Dispatcher *Dispatcher
	Record     *AnsweredRecord
	Table      *ProcessTable
	Release    string
	Heartbeat  time.Duration
	RetryAfter time.Duration
	// Clock is the journal's time the dispatcher's verifier judges expiry by; each claim answer sets its offset.
	Clock *JournalClock
}

// Claim long-polls until the context ends; a journal that does not take protocol 1 stops it with that refusal.
func (relay Relay) Claim(ctx context.Context) error {
	for ctx.Err() == nil {
		claimed, err := relay.Journal.ClaimOrders(ctx, ClaimLimit, ClaimWaitSeconds)
		if errors.Is(err, client.ErrProtocolRefused) {
			return err
		}
		if err != nil {
			relay.pause(ctx)
			continue
		}
		relay.Clock.Observe(claimed.Now)
		for _, order := range claimed.Orders {
			relay.Dispatcher.Submit(ctx, order)
		}
	}
	return ctx.Err()
}

// SendInventory tells the journal what the host holds now and the newest order it answered.
func (relay Relay) SendInventory(ctx context.Context) error {
	return relay.Journal.NotifyInventory(ctx, Inventory{
		Protocol:        Protocol,
		Release:         relay.Release,
		AnsweredThrough: relay.Record.AnsweredThrough(),
		Capabilities:    relay.Dispatcher.Capabilities(),
		Processes:       relay.Table.Inventory(),
	})
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
			_ = relay.Journal.NotifyHostHeartbeat(ctx, HostHeartbeat{
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
