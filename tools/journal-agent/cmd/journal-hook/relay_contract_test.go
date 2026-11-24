package main

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"
	"testing"

	"journal-agent/client"
	"journal-agent/hookadapter"
	"journal-agent/relaycontract"
)

// exchangeContract is the exchange the PHP hook relay's test (tests/Feature/Hooks/HookRelayTest.php) wrote against the
// real endpoint: the payload, the start's profile, each call with the answer it got, and the reply printed.
const exchangeContract = "../../../../tests/Contracts/relays/hook-exchange.json"

// comparedHeaders are the header names, or the starts of them, both relays must send alike; varyingHeaders differ on
// every call and are compared by name only.
var (
	comparedHeaders = []string{"authorization", "content-type", "x-journal-"}
	varyingHeaders  = []string{"authorization", "x-journal-call-id", "x-journal-call-issued-at", "x-journal-call-signature"}
)

type recordedAnswer struct {
	Status int    `json:"status"`
	Body   string `json:"body"`
}

type hookExchange struct {
	Payload         string            `json:"payload"`
	Profile         string            `json:"profile"`
	ProfileRevision int               `json:"profileRevision"`
	Calls           []map[string]any  `json:"calls"`
	Answers         []recordedAnswer  `json:"answers"`
	Printed         hookadapter.Reply `json:"printed"`
}

func TestTheGoHookRelaySendsAndPrintsWhatThePHPRelayDoes(t *testing.T) {
	content, err := os.ReadFile(exchangeContract)
	if err != nil {
		t.Fatal(err)
	}
	var expected hookExchange
	if err := json.Unmarshal(content, &expected); err != nil {
		t.Fatal(err)
	}
	journal, calls := answeringJournal(t, expected.Answers)
	grant := client.StartGrant{JournalURL: journal.URL, Token: "test-start-token", ProfileKey: expected.Profile, ProfileRevision: expected.ProfileRevision}
	adapter := hookadapter.Adapter{
		Ask:             hookadapter.AskJournal(grant, "claude-code", 0),
		PreparationFile: filepath.Join(t.TempDir(), "prepared"),
	}

	reply := adapter.Answer([]byte(expected.Payload))

	if actual := calls(); !same(t, actual, expected.Calls) {
		t.Errorf("the calls differ from the PHP relay's:\n got %v\nwant %v", actual, expected.Calls)
	}
	if reply != expected.Printed {
		t.Errorf("the printed reply differs from the PHP relay's:\n got %+v\nwant %+v", reply, expected.Printed)
	}
}

// answeringJournal answers each call with the next answer the real endpoint gave the PHP relay, and keeps each call
// as the contract compares it.
func answeringJournal(t *testing.T, answers []recordedAnswer) (*httptest.Server, func() []map[string]any) {
	t.Helper()
	var mutex sync.Mutex
	var kept []map[string]any
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		body, _ := io.ReadAll(request.Body)
		var decoded any
		_ = json.Unmarshal(body, &decoded)
		mutex.Lock()
		answer := recordedAnswer{Status: http.StatusInternalServerError, Body: `{"message":"no answer was recorded"}`}
		if len(kept) < len(answers) {
			answer = answers[len(kept)]
		}
		kept = append(kept, map[string]any{"path": request.URL.Path, "body": decoded, "headers": relaycontract.Headers(request.Header, comparedHeaders, varyingHeaders)})
		mutex.Unlock()
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(answer.Status)
		_, _ = writer.Write([]byte(answer.Body))
	}))
	t.Cleanup(server.Close)

	return server, func() []map[string]any {
		mutex.Lock()
		defer mutex.Unlock()

		return kept
	}
}

func same(t *testing.T, actual any, expected any) bool {
	t.Helper()
	same, err := relaycontract.SameJSON(actual, expected)
	if err != nil {
		t.Fatal(err)
	}

	return same
}
