package hostapi

import (
	"context"
	"encoding/json"
	"errors"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

var (
	testSecret = []byte("the-order-secret")
	testNow    = time.Date(2026, 11, 26, 10, 0, 0, 0, time.UTC)
)

func signedOrder(id, processID string, sequence uint64) Order {
	order := Order{
		ID:        id,
		Sequence:  sequence,
		Type:      "write_keys",
		ProcessID: processID,
		Payload:   json.RawMessage(`{"bytes":"aGk=","as_user":true}`),
		ExpiresAt: testNow.Add(5 * time.Second),
	}
	order.Signature = Sign(testSecret, order)
	return order
}

func testVerifier() Verifier {
	return Verifier{Secret: testSecret, Now: func() time.Time { return testNow }}
}

func TestTheJournalsSignatureOfAFixedOrderIsAccepted(t *testing.T) {
	order := Order{
		ID:        "01jorder0000000000000000001",
		Sequence:  7,
		Type:      "write_keys",
		ProcessID: "01jprocess000000000000000001",
		Payload:   json.RawMessage(`{"bytes":"aGk=","as_user":true}`),
		ExpiresAt: time.Date(2026, 11, 26, 10, 0, 5, 0, time.UTC),
	}
	if got := Sign(testSecret, order); got != "cc55054280b01d6115d7cf90a9f2ff3e9be711a0787a7d5cbbeb90683ace968d" {
		t.Fatalf("the signature is %s, not the one the journal makes", got)
	}
	if err := testVerifier().Verify(signedOrder("a", "p", 1)); err != nil {
		t.Fatalf("a signed order in time is refused: %v", err)
	}
}

func TestAnUnsignedAlteredOrExpiredOrderIsRefused(t *testing.T) {
	unsigned := signedOrder("a", "p", 1)
	unsigned.Signature = ""
	altered := signedOrder("a", "p", 1)
	altered.Payload = json.RawMessage(`{"bytes":"cm0gLXJm","as_user":true}`)
	expired := signedOrder("a", "p", 1)
	expired.ExpiresAt = testNow
	expired.Signature = Sign(testSecret, expired)

	for name, test := range map[string]struct {
		order   Order
		refusal Refusal
	}{
		"unsigned": {unsigned, Unsafe},
		"altered":  {altered, Unsafe},
		"expired":  {expired, Expired},
	} {
		var refusal RefusalError
		if err := testVerifier().Verify(test.order); !errors.As(err, &refusal) || refusal.Refusal != test.refusal {
			t.Errorf("the %s order is not refused as %s: %v", name, test.refusal, err)
		}
	}
}

func TestAnOrderHandedOutAgainIsAnsweredFromTheRecordAcrossARestart(t *testing.T) {
	state := t.TempDir()
	var runs atomic.Int32
	executors := map[string]Executor{"write_keys": func(context.Context, Order) (map[string]any, error) {
		runs.Add(1)
		return map[string]any{"written": 3}, nil
	}}
	var answers []Answer
	var mutex sync.Mutex
	report := func(answer Answer) {
		mutex.Lock()
		defer mutex.Unlock()
		answers = append(answers, answer)
	}

	first, err := OpenAnsweredRecord(state)
	if err != nil {
		t.Fatal(err)
	}
	dispatcher := NewDispatcher(testVerifier(), first, executors, report)
	dispatcher.Submit(context.Background(), signedOrder("a", "p", 1))
	dispatcher.Wait()

	restarted, err := OpenAnsweredRecord(state)
	if err != nil {
		t.Fatal(err)
	}
	NewDispatcher(testVerifier(), restarted, executors, report).Submit(context.Background(), signedOrder("a", "p", 1))

	if runs.Load() != 1 {
		t.Fatalf("the order ran %d times", runs.Load())
	}
	if len(answers) != 2 || answers[1].Status != Done || answers[1].Facts["written"] != float64(3) {
		t.Fatalf("the repeated order was not answered from the record: %+v", answers)
	}
}

func TestOneProcesssOrdersRunInSequenceAndTwoProcessesAtOnce(t *testing.T) {
	release := make(chan struct{})
	started := make(chan string, 8)
	var order []string
	var mutex sync.Mutex
	executors := map[string]Executor{"write_keys": func(_ context.Context, current Order) (map[string]any, error) {
		started <- current.ID
		if current.ID == "first-of-p" {
			<-release
		}
		mutex.Lock()
		order = append(order, current.ID)
		mutex.Unlock()
		return nil, nil
	}}
	record, err := OpenAnsweredRecord(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	dispatcher := NewDispatcher(testVerifier(), record, executors, func(Answer) {})

	dispatcher.Submit(context.Background(), signedOrder("first-of-p", "p", 1))
	dispatcher.Submit(context.Background(), signedOrder("second-of-p", "p", 2))
	dispatcher.Submit(context.Background(), signedOrder("first-of-q", "q", 1))

	seen := map[string]bool{<-started: true, <-started: true}
	if !seen["first-of-p"] || !seen["first-of-q"] {
		t.Fatalf("the two processes did not run at once: %v", seen)
	}
	close(release)
	dispatcher.Wait()

	if position(order, "first-of-p") > position(order, "second-of-p") {
		t.Fatalf("one process's orders ran out of sequence: %v", order)
	}
}

func position(list []string, value string) int {
	for index, item := range list {
		if item == value {
			return index
		}
	}
	return -1
}

func TestOnlyTheHostsOwnPlaceholdersAreFilled(t *testing.T) {
	placeholders := Placeholders{
		Folders:   map[string]string{"workspace": "/state/folders/01j"},
		HostNames: map[string]string{"HOME": "/home/agent"},
	}

	filled, err := placeholders.Fill("{folder:workspace}/notes in {host:HOME}")
	if err != nil || filled != "/state/folders/01j/notes in /home/agent" {
		t.Fatalf("the host's own placeholders were not filled: %q, %v", filled, err)
	}
	for _, text := range []string{"{env:SECRET}", "{folder:elsewhere}", "{host:PATH}"} {
		if _, err := placeholders.Fill(text); err == nil {
			t.Errorf("the placeholder in %q was filled", text)
		}
	}
}
