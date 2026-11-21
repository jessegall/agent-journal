package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
	"time"

	"journal-agent/client"
	"journal-agent/host"
)

// presenceJournal acknowledges every presence report with a short expiry and keeps what it was sent.
type presenceJournal struct {
	mutex   sync.Mutex
	reports []client.PresenceReport
	paths   []string
}

func (journal *presenceJournal) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	var report client.PresenceReport
	_ = json.NewDecoder(request.Body).Decode(&report)
	journal.reports = append(journal.reports, report)
	journal.paths = append(journal.paths, request.URL.Path+" "+request.Header.Get("Journal-Host-Protocol"))
	_ = json.NewEncoder(writer).Encode(map[string]any{
		"generation":        1,
		"presenceExpiresAt": time.Now().Add(2 * time.Second).Format(time.RFC3339Nano),
	})
}

func relayFor(t *testing.T, server *httptest.Server, idle time.Duration) bindingRelay {
	t.Helper()

	return bindingRelay{
		state: host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"},
		binding: host.Binding{
			Enrollment: host.Enrollment{JournalURL: server.URL, HostID: "host", Secret: "credential"},
			BindingID:  "binding-1",
		},
		release:   "1.0.0",
		transport: server.Client(),
		idle:      idle,
	}
}

func TestTheRelayReportsAndRefreshesPresenceWithOneBootUntilItsIdleWindowEnds(t *testing.T) {
	journal := &presenceJournal{}
	server := httptest.NewTLSServer(journal)
	defer server.Close()
	binder := relayFor(t, server, 1500*time.Millisecond)
	if err := binder.state.SaveBinding(binder.binding); err != nil {
		t.Fatal(err)
	}

	if err := binder.run(context.Background()); err != nil {
		t.Fatal(err)
	}

	if len(journal.reports) < 2 {
		t.Fatalf("the relay reported %d times, want a refresh", len(journal.reports))
	}
	first, second := journal.reports[0], journal.reports[1]
	if first.BootID != second.BootID || first.Sequence != 1 || second.Sequence != 2 || !first.Takeover || second.Takeover {
		t.Fatalf("reports %+v then %+v", first, second)
	}
	if journal.paths[0] != "/host/bindings/binding-1/presence 2" || first.Provisioning != "succeeded" {
		t.Fatalf("the report went to %q with %+v", journal.paths[0], first)
	}
	if report, err := binder.state.RelayReport(); err != nil || report.BootID != first.BootID {
		t.Fatalf("the relay kept %+v, %v", report, err)
	}
}

func TestASecondRelayForTheSameBindingExitsAtOnce(t *testing.T) {
	journal := &presenceJournal{}
	server := httptest.NewTLSServer(journal)
	defer server.Close()
	binder := relayFor(t, server, time.Second)
	if err := binder.state.SaveBinding(binder.binding); err != nil {
		t.Fatal(err)
	}
	unlock, err := binder.state.LockRelay()
	if err != nil {
		t.Fatal(err)
	}
	defer unlock()

	started := time.Now()
	err = binder.run(context.Background())

	if !errors.Is(err, host.ErrRelayRunning) || time.Since(started) > 500*time.Millisecond || len(journal.reports) != 0 {
		t.Fatalf("the second relay answered %v after %s with %d reports", err, time.Since(started), len(journal.reports))
	}
}

func TestConnectWaitsOnlyForAReportWhosePresenceHasNotExpired(t *testing.T) {
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"}
	if err := state.SaveBinding(host.Binding{BindingID: "binding-1"}); err != nil {
		t.Fatal(err)
	}
	started := time.Now()
	expired := host.RelayReport{BindingID: "binding-1", BootID: "old", SetupGeneration: 1, ReportedAt: time.Now(),
		ExpiresAt: time.Now().Add(-time.Minute)}
	if err := state.SaveRelayReport(expired); err != nil {
		t.Fatal(err)
	}

	if awaitReady(state, "binding-1", 1, started, 300*time.Millisecond) {
		t.Fatal("an expired report counted as ready")
	}
	live := host.RelayReport{BindingID: "binding-1", BootID: "new", SetupGeneration: 1, ReportedAt: time.Now(),
		ExpiresAt: time.Now().Add(time.Minute)}
	if err := state.SaveRelayReport(live); err != nil {
		t.Fatal(err)
	}
	if !awaitReady(state, "binding-1", 1, started, 300*time.Millisecond) {
		t.Fatal("a live report did not count as ready")
	}
}

func TestAResumedSetupIsReadyOnlyAfterAReportOfItsOwnGenerationInThisRun(t *testing.T) {
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/work/shop"}
	before := host.RelayReport{BindingID: "binding-1", BootID: "old", SetupGeneration: 1,
		ReportedAt: time.Now().Add(-time.Second), ExpiresAt: time.Now().Add(time.Minute)}
	if err := state.SaveRelayReport(before); err != nil {
		t.Fatal(err)
	}
	started := time.Now()

	if awaitReady(state, "binding-1", 2, started, 300*time.Millisecond) {
		t.Fatal("a report of the setup before counted for the resumed one")
	}
	olderRelay := host.RelayReport{BindingID: "binding-1", BootID: "old", SetupGeneration: 1, ReportedAt: time.Now(),
		ExpiresAt: time.Now().Add(time.Minute)}
	if err := state.SaveRelayReport(olderRelay); err != nil {
		t.Fatal(err)
	}
	if awaitReady(state, "binding-1", 2, started, 300*time.Millisecond) {
		t.Fatal("an older relay's report of the setup before made the resumed setup ready")
	}
	resumed := host.RelayReport{BindingID: "binding-1", BootID: "new", SetupGeneration: 2, ReportedAt: time.Now(),
		ExpiresAt: time.Now().Add(time.Minute)}
	if err := state.SaveRelayReport(resumed); err != nil {
		t.Fatal(err)
	}
	if !awaitReady(state, "binding-1", 2, started, 300*time.Millisecond) {
		t.Fatal("the resumed setup's own acknowledged report did not count")
	}
	if awaitReady(state, "binding-2", 2, started, 300*time.Millisecond) {
		t.Fatal("another binding's report counted")
	}
}
