package client

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
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

func TestAClaimReadsWhetherARequestIsTheStartsBootstrap(t *testing.T) {
	journal, _, _ := fakeJournal(t, `{"requests":[{"runtimeId":"runtime-1","requestId":"request-1","bootstrap":true},`+
		`{"runtimeId":"runtime-1","requestId":"request-2"}],"watched":[],"watched_version":1}`)

	claim, err := journal.Claim(context.Background(), 10, 5, 0)
	if err != nil {
		t.Fatal(err)
	}

	if len(claim.Requests) != 2 || !claim.Requests[0].Bootstrap || claim.Requests[1].Bootstrap {
		t.Fatalf("requests %+v", claim.Requests)
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

// Only the journal's role refusal stops a host for its role; a start the journal refuses with another 403 keeps its own
// reason, such as a start with no model default.
func TestOnlyTheRoleCodeIsARoleRefusal(t *testing.T) {
	answer := func(body string) *http.Response {
		return &http.Response{StatusCode: http.StatusForbidden, Body: io.NopCloser(strings.NewReader(body))}
	}

	role := refusalOf(answer(`{"code":"forbidden","message":"Host h is the relay of a connected folder"}`), "/host/claim")
	start := refusalOf(answer(`{"code":"default-unavailable","message":"This start has no configured model default."}`), "/host/bindings/b/runtimes")

	if !errors.Is(role, ErrHostRoleRefused) {
		t.Fatalf("a role refusal was read as %v", role)
	}
	if errors.Is(start, ErrHostRoleRefused) || !errors.Is(start, ErrRefused) || !strings.Contains(start.Error(), "no configured model default") {
		t.Fatalf("a refused start was read as %v", start)
	}
}

func TestAClaimReadsTheProjectReadsItHandsOver(t *testing.T) {
	journal, _, _ := fakeJournal(t, `{"requests":[],"project_reads":[{"id":"read-1","binding_id":"binding-1",`+
		`"type":"file","path":"src/main.go","entries_limit":500,"text_limit":262144}],"watched":[],"watched_version":1}`)

	claim, err := journal.Claim(context.Background(), 10, 5, 1)
	if err != nil {
		t.Fatal(err)
	}

	if len(claim.ProjectReads) != 1 || claim.ProjectReads[0] != (ProjectRead{ID: "read-1", BindingID: "binding-1",
		Type: ProjectReadFile, Path: "src/main.go", EntriesLimit: 500, TextLimit: 262144}) {
		t.Fatalf("project reads %+v", claim.ProjectReads)
	}
}

func TestAProjectReadReportPostsTheAnswerToItsRead(t *testing.T) {
	journal, target, body := fakeJournal(t, `{}`)
	text := "package main\n"
	size := int64(13)

	report := ProjectReadReport{Text: &text, Digest: strings.Repeat("a", 64), Size: &size}
	if err := journal.ReportProjectRead(context.Background(), "read-1", report); err != nil {
		t.Fatal(err)
	}

	if *target != "/host/reports/project-reads/read-1" {
		t.Fatalf("reported at %s", *target)
	}
	var sent ProjectReadReport
	if err := json.Unmarshal(*body, &sent); err != nil || *sent.Text != text || *sent.Size != size || sent.Truncated {
		t.Fatalf("sent %s", *body)
	}
}
