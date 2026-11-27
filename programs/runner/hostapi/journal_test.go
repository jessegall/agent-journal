package hostapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"

	"journal-runner/client"
)

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
