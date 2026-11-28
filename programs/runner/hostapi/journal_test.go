package hostapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"journal-runner/client"
)

func TestARelayClaimRefusesAnUnknownReplyField(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		_, _ = writer.Write([]byte(`{"instructions":[],"idle_window_seconds":30,"now":"2026-11-28T13:00:00Z","extra":true}`))
	}))
	defer server.Close()
	transport := client.New(client.Enrollment{JournalURL: server.URL, HostID: "h", Secret: "s"})
	relay := Journal{Client: transport, Protocol: RelayProtocolVersion}
	enrolled := Journal{Client: transport, Protocol: ProtocolVersion}

	if _, err := relay.ClaimInstruction(t.Context(), 1, 0); err == nil || !strings.Contains(err.Error(), "extra") {
		t.Fatalf("relay protocol error: %v", err)
	}
	if _, err := enrolled.ClaimInstruction(t.Context(), 1, 0); err != nil {
		t.Fatalf("enrolled protocol changed: %v", err)
	}
}

func TestAnAnswerTheJournalMayNotHaveReceivedIsSentAgainUntilItIsTaken(t *testing.T) {
	var calls atomic.Int32
	journal := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
		if calls.Add(1) == 1 {
			connection, _, _ := writer.(http.Hijacker).Hijack()
			_ = connection.Close()
			return
		}
		writer.Header().Set("Content-Type", "application/json")
		_, _ = writer.Write([]byte("{}"))
	}))
	defer journal.Close()
	answers := Journal{Client: client.New(client.Enrollment{JournalURL: journal.URL, HostID: "h", Secret: "s"})}

	err := answers.AnswerUntilTaken(context.Background(), Answer{InstructionID: "o", Status: Done}, 10*time.Millisecond, time.Now().Add(time.Minute))

	if err != nil || calls.Load() != 2 {
		t.Fatalf("the answer was not sent again once the journal dropped it: %v after %d calls", err, calls.Load())
	}
}
