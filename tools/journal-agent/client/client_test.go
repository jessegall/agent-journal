package client

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"journal-agent/screen"
)

// fakeJournal answers every call with the answer and keeps the last call's target and body.
func fakeJournal(t *testing.T, answer string) (*Client, *string, *[]byte) {
	t.Helper()
	target, body := "", []byte{}
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		target = request.URL.RequestURI()
		body, _ = io.ReadAll(request.Body)
		writer.Header().Set("Content-Type", "application/json")
		io.WriteString(writer, answer)
	}))
	t.Cleanup(server.Close)

	return New(Enrollment{JournalURL: server.URL, HostID: "host", Secret: "secret"}), &target, &body
}

func TestAClaimSendsTheWatchedVersionAndReadsTheWatchedList(t *testing.T) {
	journal, target, _ := fakeJournal(t, `{"requests":[{"runtimeId":"runtime-1","requestId":"request-1"}],`+
		`"watched":[{"runtime_id":"runtime-1","interval_ms":500}],"watched_version":4}`)

	claim, err := journal.Claim(context.Background(), 10, 5, 3)
	if err != nil {
		t.Fatal(err)
	}

	if *target != "/host/claim?limit=10&wait=5&watched_version=3" {
		t.Fatalf("claimed at %s", *target)
	}
	if len(claim.Requests) != 1 || claim.Requests[0].RequestID != "request-1" {
		t.Fatalf("requests %+v", claim.Requests)
	}
	if len(claim.Watched) != 1 || claim.Watched[0] != (Watch{RuntimeID: "runtime-1", IntervalMs: 500}) {
		t.Fatalf("watched %+v", claim.Watched)
	}
	if claim.WatchedVersion != 4 {
		t.Fatalf("watched version %d", claim.WatchedVersion)
	}
}

func TestAScreenReportPostsTheFrameToTheScreenRoute(t *testing.T) {
	journal, target, body := fakeJournal(t, `{"status":"accepted"}`)
	frame := screen.Frame{Epoch: "epoch", Sequence: 7, Columns: 20, Rows: [][]screen.Run{{{Text: "hello"}}}}

	if err := journal.ReportScreen(context.Background(), "runtime-1", frame); err != nil {
		t.Fatal(err)
	}

	if *target != "/host/reports/screen" {
		t.Fatalf("reported at %s", *target)
	}
	var sent struct {
		RuntimeID string       `json:"runtime_id"`
		Frame     screen.Frame `json:"frame"`
	}
	if err := json.Unmarshal(*body, &sent); err != nil {
		t.Fatal(err)
	}
	if sent.RuntimeID != "runtime-1" || sent.Frame.Sequence != 7 || sent.Frame.Rows[0][0].Text != "hello" {
		t.Fatalf("sent %+v", sent)
	}
}

func TestARefusedScreenReportIsToldApartFromAFailure(t *testing.T) {
	journal, _, _ := fakeJournal(t, `{"status":"refused","reason":"nobody watches this runtime"}`)

	err := journal.ReportScreen(context.Background(), "runtime-1", screen.Frame{})

	var refused ScreenRefused
	if !errors.As(err, &refused) || refused.Reason != "nobody watches this runtime" {
		t.Fatalf("got %v", err)
	}
}
