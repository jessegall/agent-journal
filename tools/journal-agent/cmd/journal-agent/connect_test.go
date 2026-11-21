package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"

	"journal-agent/client"
	"journal-agent/host"
)

// fakeJournal redeems each ticket once and recovers a binding for the credential that redeemed it. It can drop the
// reply to the next calls of a target after doing their work, as a lost connection does.
type fakeJournal struct {
	mutex    sync.Mutex
	tickets  map[string]bool
	bindings map[string]client.Redemption
	hosts    int
	drops    map[string]int
}

func newFakeJournal(tickets ...string) *fakeJournal {
	journal := &fakeJournal{tickets: map[string]bool{}, bindings: map[string]client.Redemption{}, drops: map[string]int{}}
	for _, ticket := range tickets {
		journal.tickets[ticket] = true
	}

	return journal
}

func (journal *fakeJournal) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	journal.mutex.Lock()
	defer journal.mutex.Unlock()

	answer, status := journal.answer(request)
	if journal.drops[request.URL.Path] > 0 {
		journal.drops[request.URL.Path]--
		connection, _, _ := writer.(http.Hijacker).Hijack()
		connection.Close()
		return
	}
	writer.WriteHeader(status)
	_ = json.NewEncoder(writer).Encode(answer)
}

func (journal *fakeJournal) answer(request *http.Request) (any, int) {
	switch request.URL.Path {
	case "/api/project-connections/redeem":
		var redeem client.RedeemRequest
		_ = json.NewDecoder(request.Body).Decode(&redeem)
		if !journal.tickets[redeem.Ticket] {
			return map[string]string{"message": "This install line cannot be used."}, http.StatusNotFound
		}
		journal.tickets[redeem.Ticket] = false
		journal.hosts++
		redemption := client.Redemption{HostID: "host-" + redeem.InstallationNonce, ProjectID: "project", BindingID: "binding-" + redeem.InstallationNonce, Protocol: 2, CanonicalOrigin: "https://journal.example.com"}
		journal.bindings[redeem.HostCredential+" "+redeem.InstallationNonce] = redemption
		return redemption, http.StatusCreated
	case "/api/project-connections/recover":
		var recover struct {
			InstallationNonce string `json:"installationNonce"`
		}
		_ = json.NewDecoder(request.Body).Decode(&recover)
		credential := strings.TrimPrefix(request.Header.Get("Authorization"), "Bearer ")
		redemption, found := journal.bindings[credential+" "+recover.InstallationNonce]
		if !found || request.Header.Get("Journal-Host-Protocol") != "2" {
			return map[string]string{"message": "This connection cannot be recovered."}, http.StatusNotFound
		}
		return redemption, http.StatusOK
	}

	return nil, http.StatusNotFound
}

func connectionTo(t *testing.T, server *httptest.Server, stateFolder string, root string) projectConnection {
	t.Helper()

	return projectConnection{
		state:     host.ConnectionState{Folder: stateFolder, CanonicalRoot: root},
		origin:    server.URL,
		transport: server.Client(),
	}
}

func TestConnectRedeemsOnceAndKeepsTheBindingPrivately(t *testing.T) {
	journal := newFakeJournal("the-ticket")
	server := httptest.NewTLSServer(journal)
	defer server.Close()
	state := t.TempDir()
	connection := connectionTo(t, server, state, "/work/shop")

	binding, err := connection.redeem(context.Background(), "the-ticket")
	if err != nil {
		t.Fatal(err)
	}
	again, err := connection.redeem(context.Background(), "the-ticket")
	if err != nil {
		t.Fatal(err)
	}

	if journal.hosts != 1 || binding.BindingID != again.BindingID || binding.JournalURL != "https://journal.example.com" {
		t.Fatalf("hosts %d, bindings %+v and %+v", journal.hosts, binding, again)
	}
	saved, err := connection.state.Binding()
	if err != nil || saved.Secret == "" || saved.Secret != binding.Secret {
		t.Fatalf("the saved binding %+v, %v", saved, err)
	}
	assertPrivateFiles(t, state)
}

func TestARunWhoseReplyIsLostRecoversTheSameBindingOnTheNextRun(t *testing.T) {
	journal := newFakeJournal("the-ticket")
	journal.drops["/api/project-connections/redeem"] = 1
	journal.drops["/api/project-connections/recover"] = 1
	server := httptest.NewTLSServer(journal)
	defer server.Close()
	connection := connectionTo(t, server, t.TempDir(), "/work/shop")

	if _, err := connection.redeem(context.Background(), "the-ticket"); !errors.Is(err, client.ErrUncertain) {
		t.Fatalf("a run whose replies were lost answered %v, want ErrUncertain", err)
	}
	binding, err := connection.redeem(context.Background(), "the-ticket")
	if err != nil {
		t.Fatal(err)
	}

	if journal.hosts != 1 || binding.HostID == "" {
		t.Fatalf("the next run made %d hosts and recovered %+v", journal.hosts, binding)
	}
}

func TestTwoConnectsRacingOnOneTicketLeaveOneConnectedAndOneRefused(t *testing.T) {
	journal := newFakeJournal("the-ticket")
	server := httptest.NewTLSServer(journal)
	defer server.Close()
	connections := []projectConnection{
		connectionTo(t, server, t.TempDir(), "/work/shop"),
		connectionTo(t, server, t.TempDir(), "/work/other"),
	}

	failures := make([]error, len(connections))
	var group sync.WaitGroup
	for index, connection := range connections {
		group.Add(1)
		go func() {
			defer group.Done()
			_, failures[index] = connection.redeem(context.Background(), "the-ticket")
		}()
	}
	group.Wait()

	refused := 0
	for _, failure := range failures {
		if errors.Is(failure, errLineUnusable) {
			refused++
		}
	}
	if journal.hosts != 1 || refused != 1 {
		t.Fatalf("hosts %d, failures %v", journal.hosts, failures)
	}
}

func TestTheTicketIsReadFromStandardInputOnly(t *testing.T) {
	input := filepath.Join(t.TempDir(), "input")
	if err := os.WriteFile(input, []byte("the-ticket\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	file, err := os.Open(input)
	if err != nil {
		t.Fatal(err)
	}
	defer file.Close()

	ticket, err := readTicket(file)
	if err != nil || ticket != "the-ticket" {
		t.Fatalf("read %q, %v", ticket, err)
	}
	if err := connect([]string{"--origin", "https://journal.example.com"}); err == nil {
		t.Fatal("connect ran without --ticket-stdin")
	}
}

// assertPrivateFiles fails on any file or folder of the state that someone other than its owner may read.
func assertPrivateFiles(t *testing.T, state string) {
	t.Helper()
	err := filepath.WalkDir(state, func(path string, entry os.DirEntry, err error) error {
		if err != nil || path == state {
			return err
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		if info.Mode().Perm()&0o077 != 0 {
			t.Errorf("%s has mode %o", path, info.Mode().Perm())
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}
