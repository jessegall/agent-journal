package main

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"sort"
	"strings"
	"sync"
	"testing"

	"journal-agent/client"
	"journal-agent/mcprelay"
	"journal-agent/relaycontract"
)

// exchangeContract is the exchange the PHP relay's test (tests/Feature/Mcp/RelayTest.php) wrote: the frames it was
// given, each call it sent as both relays must send it, and the lines it printed.
const exchangeContract = "../../../../tests/Contracts/relays/mcp-exchange.json"

// comparedHeaders are the header names, or the starts of them, both relays must send alike; varyingHeaders differ on
// every call and are compared by name only.
var (
	comparedHeaders = []string{"authorization", "content-type", "mcp-", "x-journal-"}
	varyingHeaders  = []string{"x-journal-call-id", "x-journal-call-issued-at", "x-journal-call-signature"}
)

type exchange struct {
	Frames  []string         `json:"frames"`
	Calls   []map[string]any `json:"calls"`
	Printed []map[string]any `json:"printed"`
}

func TestTheGoRelaySendsAndPrintsWhatThePHPRelayDoes(t *testing.T) {
	content, err := os.ReadFile(exchangeContract)
	if err != nil {
		t.Fatal(err)
	}
	var expected exchange
	if err := json.Unmarshal(content, &expected); err != nil {
		t.Fatal(err)
	}
	journal, calls := standInJournal(t)
	grant := client.StartGrant{JournalURL: journal.URL, Token: "test-start-token", ProfileKey: "main-agent", ProfileRevision: 1}
	var output bytes.Buffer

	relay := mcprelay.Relay{Send: sendWith(grant), Output: &output, Errors: io.Discard}
	relay.Run(context.Background(), strings.NewReader(strings.Join(expected.Frames, "\n")+"\n"))

	if actual := calls(); !isSame(t, actual, expected.Calls) {
		t.Errorf("the calls differ from the PHP relay's:\n got %v\nwant %v", actual, expected.Calls)
	}
	if actual := printedLines(t, output.String()); !isSame(t, actual, expected.Printed) {
		t.Errorf("the printed lines differ from the PHP relay's:\n got %v\nwant %v", actual, expected.Printed)
	}
}

// standInJournal answers as tests/Fixtures/Mcp/relay-server.php does and keeps each call as the contract compares it,
// in the order of their methods.
func standInJournal(t *testing.T) (*httptest.Server, func() []map[string]any) {
	t.Helper()
	var mutex sync.Mutex
	var kept []map[string]any
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		body, _ := io.ReadAll(request.Body)
		var frame map[string]any
		_ = json.Unmarshal(body, &frame)
		mutex.Lock()
		kept = append(kept, map[string]any{"path": request.URL.Path, "body": frame, "headers": relaycontract.Headers(request.Header, comparedHeaders, varyingHeaders)})
		mutex.Unlock()
		writer.Header().Set("Content-Type", "application/json")
		if _, isCall := frame["id"]; !isCall {
			writer.WriteHeader(http.StatusAccepted)

			return
		}
		_ = json.NewEncoder(writer).Encode(map[string]any{"jsonrpc": "2.0", "id": frame["id"], "result": resultFor(frame, request.Header)})
	}))
	t.Cleanup(server.Close)

	return server, func() []map[string]any {
		mutex.Lock()
		defer mutex.Unlock()
		sort.Slice(kept, func(first, second int) bool {
			return methodOf(kept[first]) < methodOf(kept[second])
		})

		return kept
	}
}

func resultFor(frame map[string]any, headers http.Header) any {
	if frame["method"] == "initialize" {
		return map[string]any{"protocolVersion": "2025-11-25", "serverInfo": map[string]any{"name": "journal", "version": "1.0.0"}}
	}
	var protocol any
	if value := headers.Get("Mcp-Protocol-Version"); value != "" {
		protocol = value
	}

	return map[string]any{"method": frame["method"], "signed": headers.Get("X-Journal-Call-Signature") != "", "protocol": protocol}
}

func methodOf(call map[string]any) string {
	body, _ := call["body"].(map[string]any)
	method, _ := body["method"].(string)

	return method
}

func printedLines(t *testing.T, output string) []map[string]any {
	t.Helper()
	var lines []map[string]any
	for _, line := range strings.Split(strings.TrimSpace(output), "\n") {
		var decoded map[string]any
		if err := json.Unmarshal([]byte(line), &decoded); err != nil {
			t.Fatalf("the relay printed a line that is not JSON: %q", line)
		}
		lines = append(lines, decoded)
	}

	return lines
}

func isSame(t *testing.T, actual any, expected any) bool {
	t.Helper()
	same, err := relaycontract.SameJSON(actual, expected)
	if err != nil {
		t.Fatal(err)
	}

	return same
}
