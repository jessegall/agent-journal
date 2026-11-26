package hostapi

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"journal-agent/client"
)

// fakeJournal answers the relay's calls as a test sets them up and keeps what the relay sent.
type fakeJournal struct {
	mutex      sync.Mutex
	claims     [][]Order
	claimCount int
	refuse     bool
	answers    []Answer
	inventory  []Inventory
	heartbeats []HostHeartbeat
}

func (journal *fakeJournal) ClaimOrders(ctx context.Context, _, _ int) (ClaimedOrders, error) {
	journal.mutex.Lock()
	journal.claimCount++
	if journal.refuse {
		journal.mutex.Unlock()
		return ClaimedOrders{}, errors.Join(client.ErrProtocolRefused, client.ErrRefused)
	}
	if len(journal.claims) > 0 {
		orders := journal.claims[0]
		journal.claims = journal.claims[1:]
		journal.mutex.Unlock()
		return ClaimedOrders{Orders: orders, IdleWindowSeconds: 600}, nil
	}
	journal.mutex.Unlock()
	<-ctx.Done()
	return ClaimedOrders{}, ctx.Err()
}

func (journal *fakeJournal) AnswerOrder(_ context.Context, answer Answer) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.answers = append(journal.answers, answer)
	return nil
}

func (journal *fakeJournal) NotifyInventory(_ context.Context, inventory Inventory) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.inventory = append(journal.inventory, inventory)
	return nil
}

func (journal *fakeJournal) NotifyHostHeartbeat(_ context.Context, heartbeat HostHeartbeat) error {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	journal.heartbeats = append(journal.heartbeats, heartbeat)
	return nil
}

func relayFor(t *testing.T, journal *fakeJournal) (Relay, []byte) {
	t.Helper()
	secret := []byte("the-order-secret")
	record, err := OpenAnsweredRecord(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	executors := map[string]Executor{
		"snapshot": func(context.Context, Order) (map[string]any, error) { return map[string]any{"shown": true}, nil },
	}
	clock := &JournalClock{Host: time.Now}
	dispatcher := NewDispatcher(Verifier{Secret: secret, Now: clock.Now}, record, executors, func(_ Order, answer Answer) {
		_ = journal.AnswerOrder(context.Background(), answer)
	})
	outputs := NewOutputs(t.TempDir(), func(string, Output) error { return nil }, time.Now)
	table := &ProcessTable{outputs: outputs, processes: map[string]*heldProcess{}}
	relay := Relay{Journal: journal, Dispatcher: dispatcher, Record: record, Table: table, Release: "6.0.0",
		Heartbeat: 10 * time.Millisecond, RetryAfter: time.Millisecond, Clock: clock}
	return relay, secret
}

func TestAClaimedOrderIsAnsweredByRoute(t *testing.T) {
	journal := &fakeJournal{}
	relay, secret := relayFor(t, journal)
	order := Order{ID: "01jorder", Sequence: 1, Type: "snapshot", ProcessID: "p", Payload: "{}",
		ExpiresAt: time.Now().Add(time.Minute).UTC().Truncate(time.Second)}
	order.Signature = Sign(secret, order)
	journal.claims = [][]Order{{order}}
	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	_ = relay.Claim(ctx)
	relay.Dispatcher.Wait()

	if len(journal.answers) != 1 || journal.answers[0].Status != Done || journal.answers[0].OrderID != order.ID {
		t.Fatalf("the claimed order was not answered done: %+v", journal.answers)
	}
	if err := relay.SendInventory(context.Background()); err != nil || journal.inventory[0].AnsweredThrough != order.ID {
		t.Fatalf("the inventory does not name the order answered last: %+v, %v", journal.inventory, err)
	}
}

func TestHeartbeatsAreSentAtTheirInterval(t *testing.T) {
	journal := &fakeJournal{}
	relay, _ := relayFor(t, journal)
	ctx, cancel := context.WithTimeout(context.Background(), 55*time.Millisecond)
	defer cancel()

	relay.Beat(ctx)

	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	if len(journal.heartbeats) < 3 {
		t.Fatalf("only %d heartbeats in five intervals", len(journal.heartbeats))
	}
}

func TestARefusedProtocolStopsClaiming(t *testing.T) {
	journal := &fakeJournal{refuse: true}
	relay, _ := relayFor(t, journal)

	err := relay.Claim(context.Background())

	if !errors.Is(err, client.ErrProtocolRefused) || journal.claimCount != 1 {
		t.Fatalf("a refused protocol claimed %d times and ended with %v", journal.claimCount, err)
	}
}

func TestAnOrdersExpiryHoldsAgainstAHostClockMinutesOffBothWays(t *testing.T) {
	journalNow := time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)
	secret := []byte("the-order-secret")
	for name, hostOffset := range map[string]time.Duration{"fast": 5 * time.Minute, "slow": -5 * time.Minute} {
		clock := &JournalClock{Host: func() time.Time { return journalNow.Add(hostOffset) }}
		clock.Observe(journalNow)
		verifier := Verifier{Secret: secret, Now: clock.Now}
		live := Order{ID: "live", Type: "snapshot", Payload: "{}", ExpiresAt: journalNow.Add(30 * time.Second)}
		live.Signature = Sign(secret, live)
		dead := Order{ID: "dead", Type: "snapshot", Payload: "{}", ExpiresAt: journalNow.Add(-time.Second)}
		dead.Signature = Sign(secret, dead)

		if err := verifier.Verify(live); err != nil {
			t.Errorf("a host clock %s refuses a live order: %v", name, err)
		}
		if err := verifier.Verify(dead); err == nil {
			t.Errorf("a host clock %s runs an expired order", name)
		}
	}
}
