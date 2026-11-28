// Package hostapitest plays a recorded journal for host and relay tests.
package hostapitest

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"

	"journal-runner/client"
	"journal-runner/hostapi"
	"journal-runner/recorded"
	"journal-runner/recording"
)

const EnrollmentSecret = "the-test-host-enrollment-secret"

const claimPath = "/host/instructions/claim"

type Journal struct {
	Calls      *recorded.CallReplay
	URL        string
	FirstClaim <-chan struct{}
}

// Replay serves the journal's side of the host exchange and signs its recorded orders with EnrollmentSecret.
func Replay(t testing.TB, scenario recorded.Scenario) Journal {
	t.Helper()
	replay := recorded.MustCallReplay(t, scenario, recording.WireHost)
	replay.IsLongPoll = func(call recorded.Call) bool { return call.Request().Path == claimPath }
	replay.OrderGroup = func(recorded.Call) string { return "the journal" }
	replay.IsStreamed = func(call recorded.Call) bool {
		path := call.Request().Path
		return strings.HasSuffix(path, "/output") || path == "/host/heartbeat"
	}
	secret := hostapi.InstructionSecretOf(EnrollmentSecret)
	replay.Answering = func(call recorded.Call, body []byte) []byte {
		instructions, claim := ClaimedOf(call, body)
		if claim == nil {
			return body
		}
		for index := range instructions {
			instructions[index].Signature = hostapi.Sign(secret, instructions[index])
		}
		claim["instructions"], _ = json.Marshal(instructions)
		signed, _ := json.Marshal(claim)
		return signed
	}
	claimed := make(chan struct{})
	var first sync.Once
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if scenario.Manifest.Protocol == hostapi.RelayProtocolVersion {
			if err := readRelayRequest(request); err != nil {
				t.Errorf("relay %s %s: %v", request.Method, request.URL.Path, err)
				writer.WriteHeader(http.StatusUnprocessableEntity)
				return
			}
		}
		if request.URL.Path == claimPath {
			first.Do(func() { close(claimed) })
			if !replay.HasUnplayed(http.MethodPost, claimPath) {
				select {
				case <-request.Context().Done():
				case <-replay.Closed():
				}
				return
			}
		}
		replay.ServeHTTP(writer, request)
	}))
	t.Cleanup(func() {
		replay.Close()
		server.Close()
	})
	return Journal{Calls: replay, URL: server.URL, FirstClaim: claimed}
}

// ClaimedOf reads the instructions from the reply to a claim.
func ClaimedOf(call recorded.Call, body []byte) ([]hostapi.Instruction, map[string]json.RawMessage) {
	if call.Answered.Path != claimPath {
		return nil, nil
	}
	var claim map[string]json.RawMessage
	var instructions []hostapi.Instruction
	if json.Unmarshal(body, &claim) != nil || json.Unmarshal(claim["instructions"], &instructions) != nil {
		return nil, nil
	}
	return instructions, claim
}

// Connected loads the call exchange identified by a protocol 2 inventory from the named recording.
func Connected(t testing.TB, name string) (recorded.Scenario, hostapi.Inventory) {
	t.Helper()
	scenario := recorded.MustLoad(t, name)
	calls, err := scenario.Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	for _, call := range calls {
		if call.Asked.Path != "/host/inventory" {
			continue
		}
		body, err := base64.StdEncoding.DecodeString(call.Asked.Body)
		if err != nil {
			t.Fatal(err)
		}
		inventory, err := hostapi.ReadWirePayload[hostapi.Inventory](body)
		if err != nil {
			t.Fatal(err)
		}
		if inventory.Protocol != hostapi.RelayProtocolVersion {
			continue
		}
		exchange, found := scenario.Exchange(call.Exchange)
		if !found {
			t.Fatalf("the relay inventory names missing exchange %s", call.Exchange)
		}
		scenario.Exchanges = []recorded.Exchange{exchange}
		return scenario, inventory
	}
	t.Fatalf("%s has no protocol 2 inventory", scenario.Name)
	return recorded.Scenario{}, hostapi.Inventory{}
}

func readRelayRequest(request *http.Request) error {
	body, err := io.ReadAll(request.Body)
	if err != nil {
		return err
	}
	request.Body = io.NopCloser(bytes.NewReader(body))
	parts := strings.Split(strings.TrimPrefix(request.URL.Path, "/"), "/")
	if len(parts) < 2 || parts[0] != "host" {
		return fmt.Errorf("unknown relay route")
	}
	for field := range request.URL.Query() {
		if request.URL.Path != claimPath || (field != "limit" && field != "wait") {
			return fmt.Errorf("unknown relay query field %s", field)
		}
	}
	if len(body) == 0 {
		body = []byte("{}")
	}
	switch {
	case request.Method == http.MethodGet && request.URL.Path == "/host/workspace-reads":
		_, err = hostapi.ReadWirePayload[hostapi.Empty](body)
	case request.Method != http.MethodPost:
		return fmt.Errorf("unknown relay method")
	case request.URL.Path == claimPath, len(parts) == 3 && parts[1] == "private-values":
		_, err = hostapi.ReadWirePayload[hostapi.Empty](body)
	case request.URL.Path == "/host/inventory":
		_, err = hostapi.ReadWirePayload[hostapi.Inventory](body)
	case request.URL.Path == "/host/heartbeat":
		_, err = hostapi.ReadWirePayload[hostapi.HostHeartbeat](body)
	case parts[1] == "bindings" && len(parts) == 4 && parts[3] == "presence":
		_, err = hostapi.ReadWirePayload[hostapi.BindingPresence](body)
	case parts[1] == "instructions" && len(parts) == 3:
		_, err = hostapi.ReadWirePayload[hostapi.Answer](body)
	case parts[1] == "processes" && len(parts) == 3:
		_, err = hostapi.ReadWirePayload[hostapi.ProcessReport](body)
	case parts[1] == "processes" && len(parts) == 4 && parts[3] == "output":
		_, err = hostapi.ReadWirePayload[hostapi.Output](body)
	case parts[1] == "reports" && len(parts) == 4 && parts[2] == "project-reads":
		_, err = hostapi.ReadWirePayload[client.ProjectReadReport](body)
	case parts[1] == "workspace-reads" && len(parts) == 3:
		_, err = hostapi.ReadWirePayload[hostapi.WorkspaceReadReport](body)
	default:
		return fmt.Errorf("unknown relay route")
	}
	return err
}
