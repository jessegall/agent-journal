package host

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"journal-agent/client"
)

type switchableEvidence struct{ alive atomic.Bool }

func (evidence *switchableEvidence) IsCurrent() bool        { return evidence.alive.Load() }
func (evidence *switchableEvidence) ProcessGeneration() int { return 3 }
func (evidence *switchableEvidence) Description() string    { return "owned process alive" }

func journalAnswering(t *testing.T, status int, beats *atomic.Int32) *client.Client {
	t.Helper()
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if !strings.HasSuffix(request.URL.Path, "/host/reports/heartbeat") {
			t.Errorf("unexpected path %s", request.URL.Path)
		}
		if request.Header.Get("X-Journal-Call-Signature") == "" {
			t.Error("the beat is not signed")
		}
		beats.Add(1)
		writer.WriteHeader(status)
	}))
	t.Cleanup(server.Close)
	return client.New(Enrollment{JournalURL: server.URL, HostID: "host", Secret: "secret"})
}

func TestALiveRuntimeBeatsAtOnceAndThenAtEachInterval(t *testing.T) {
	var beats atomic.Int32
	evidence := &switchableEvidence{}
	evidence.alive.Store(true)
	sender := HeartbeatSender{Client: journalAnswering(t, http.StatusNoContent, &beats), RuntimeID: "runtime", Evidence: evidence, interval: 20 * time.Millisecond}
	ctx, cancel := context.WithTimeout(context.Background(), 70*time.Millisecond)
	defer cancel()

	sender.Run(ctx)

	if beats.Load() < 3 {
		t.Fatalf("got %d beats", beats.Load())
	}
}

func TestLostEvidenceStopsTheBeats(t *testing.T) {
	var beats atomic.Int32
	evidence := &switchableEvidence{}
	evidence.alive.Store(true)
	sender := HeartbeatSender{Client: journalAnswering(t, http.StatusNoContent, &beats), RuntimeID: "runtime", Evidence: evidence, interval: 10 * time.Millisecond}
	done := make(chan struct{})
	go func() { sender.Run(context.Background()); close(done) }()

	time.Sleep(15 * time.Millisecond)
	evidence.alive.Store(false)

	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("the sender kept going after the evidence ended")
	}
}

func TestARefusedBeatStopsTheSender(t *testing.T) {
	var beats atomic.Int32
	evidence := &switchableEvidence{}
	evidence.alive.Store(true)
	sender := HeartbeatSender{Client: journalAnswering(t, http.StatusConflict, &beats), RuntimeID: "runtime", Evidence: evidence, interval: 10 * time.Millisecond}

	sender.Run(context.Background())

	if beats.Load() != 1 {
		t.Fatalf("got %d beats after a refusal", beats.Load())
	}
}
