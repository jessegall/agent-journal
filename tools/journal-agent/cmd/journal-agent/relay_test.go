package main

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-agent/host"
	"journal-agent/hostapi"
)

const (
	relayTestSecret  = "the-binding-secret"
	relayTestBinding = "01jbinding00000000000000001"
	relayTestProcess = "01jprocess00000000000000001"
)

// standinJournal answers a relay as the journal does: the first claim hands it one order, every later claim none, each
// naming the idle window, a presence report is acknowledged for a moment, and each process report is kept.
type standinJournal struct {
	order   hostapi.Order
	idle    int
	mutex   sync.Mutex
	claims  int
	reports []hostapi.ProcessReport
}

func (journal *standinJournal) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	now := time.Now()
	switch {
	case strings.HasPrefix(request.URL.Path, "/host/orders/claim"):
		journal.answerClaim(writer, now)
	case strings.HasSuffix(request.URL.Path, "/presence"):
		writeJSON(writer, map[string]any{"bindingId": relayTestBinding, "generation": 1, "serverTime": now,
			"presenceExpiresAt": now.Add(200 * time.Millisecond), "authorityGeneration": 1, "readiness": "ready"})
	case request.URL.Path == "/host/processes/"+relayTestProcess:
		var report hostapi.ProcessReport
		_ = json.NewDecoder(request.Body).Decode(&report)
		journal.mutex.Lock()
		journal.reports = append(journal.reports, report)
		journal.mutex.Unlock()
		writeJSON(writer, map[string]any{})
	default:
		writeJSON(writer, map[string]any{})
	}
}

func (journal *standinJournal) answerClaim(writer http.ResponseWriter, now time.Time) {
	journal.mutex.Lock()
	journal.claims++
	isFirst := journal.claims == 1
	journal.mutex.Unlock()
	orders := []hostapi.Order{}
	if isFirst {
		orders = append(orders, journal.order)
	} else {
		time.Sleep(50 * time.Millisecond)
	}
	writeJSON(writer, map[string]any{"orders": orders, "now": now, "idle_window_s": journal.idle})
}

func (journal *standinJournal) reportsOf(kind string) int {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()
	count := 0
	for _, report := range journal.reports {
		if report.Report == kind {
			count++
		}
	}
	return count
}

func writeJSON(writer http.ResponseWriter, value any) {
	writer.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(writer).Encode(value)
}

// openOrder is the journal's signed order to open a pipe process that lives for the given seconds.
func openOrder(t *testing.T, folder string, seconds string) hostapi.Order {
	plan, err := json.Marshal(hostapi.OpenPlan{Type: "pipe", Restart: "never",
		Argv: []string{"sleep", seconds}, Folder: folder, Inherit: []string{"PATH"}})
	if err != nil {
		t.Fatal(err)
	}
	order := hostapi.Order{ID: "01jorder0000000000000000001", Sequence: 1, Type: "open_process",
		ProcessID: relayTestProcess, Payload: string(plan), ExpiresAt: time.Now().Add(30 * time.Second)}
	order.Signature = hostapi.Sign(hostapi.OrderSecretOf(relayTestSecret), order)
	return order
}

// connectedRelay is the relay of a binding redeemed for a folder of its own, signing with the stand-in's secret.
func connectedRelay(t *testing.T, journalURL string) bindingRelay {
	root := t.TempDir()
	state := host.ConnectionState{Folder: t.TempDir(), CanonicalRoot: root}
	binding := host.Binding{
		Enrollment:    host.Enrollment{JournalURL: journalURL, HostID: "01jhost000000000000000000001", Secret: relayTestSecret},
		BindingID:     relayTestBinding,
		CanonicalRoot: root,
	}
	if err := state.SaveBinding(binding); err != nil {
		t.Fatal(err)
	}
	installation := host.Installation{Folder: t.TempDir()}
	// The relay opens only what its installer sealed: the test's sleep is on its list.
	allowList := hostapi.AllowedProgramsFile(state.Folder, filepath.Base(installation.Folder))
	allowed, _ := json.Marshal(hostapi.AllowedPrograms{Programs: map[string]string{"SLEEP": "sleep"}})
	if err := os.MkdirAll(filepath.Dir(allowList), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(allowList, allowed, 0o600); err != nil {
		t.Fatal(err)
	}
	return bindingRelay{state: state, binding: binding, installation: installation,
		release: "test", transport: &http.Client{Timeout: 5 * time.Second}, idle: &hostapi.IdleWindow{}}
}

func TestARelayStaysOnlineWhileItsProcessLivesAndLeavesOnceItEndedAndTheIdleWindowPassed(t *testing.T) {
	journal := &standinJournal{order: openOrder(t, t.TempDir(), "2"), idle: 1}
	server := httptest.NewServer(journal)
	defer server.Close()
	relay := connectedRelay(t, server.URL)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	started := time.Now()
	err := relay.run(ctx)
	ran := time.Since(started)

	if err != nil {
		t.Fatalf("the relay ended with %v", err)
	}
	if ctx.Err() != nil {
		t.Fatal("the relay never left once its process ended and its idle window passed")
	}
	if ran < 2*time.Second {
		t.Fatalf("the relay left after %v, while its process still lived", ran)
	}
	if journal.reportsOf("exited") != 1 {
		t.Fatalf("the journal heard %d exits of the process, not one", journal.reportsOf("exited"))
	}
}

func TestARelayWithNoProcessLeavesOnceItsIdleWindowPassed(t *testing.T) {
	journal := &standinJournal{order: openOrder(t, t.TempDir(), "1"), idle: 1}
	journal.claims = 1
	server := httptest.NewServer(journal)
	defer server.Close()
	relay := connectedRelay(t, server.URL)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	started := time.Now()
	if err := relay.run(ctx); err != nil {
		t.Fatalf("the relay ended with %v", err)
	}

	if ran := time.Since(started); ran < time.Second || ran > 3*time.Second {
		t.Fatalf("an idle relay given a window of one second left after %v", ran)
	}
}
