package mcprelay

import (
	"bytes"
	"context"
	"errors"
	"strings"
	"sync"
	"testing"
	"time"
)

// sentFrame is one frame as the relay handed it to the journal.
type sentFrame struct {
	body    string
	headers map[string]string
}

// relayed runs the relay over the input with a journal that answers as given, and returns what the driver read
// back and what the journal was sent.
func relayed(t *testing.T, input string, answer func(body string) (Answer, error)) (string, []sentFrame) {
	t.Helper()
	var output, diagnostics bytes.Buffer
	var sent []sentFrame
	relay := Relay{
		Output: &output, Errors: &diagnostics,
		Send: func(_ context.Context, body []byte, _ time.Time, headers map[string]string) (Answer, error) {
			sent = append(sent, sentFrame{body: string(body), headers: headers})

			return answer(string(body))
		},
	}
	relay.Run(context.Background(), strings.NewReader(input))

	return output.String(), sent
}

// Each frame reaches the journal as the exact bytes the driver wrote, its answer comes back as one line, and the
// version a legacy initialize negotiated travels with the frames after it.
func TestFramesReachTheJournalAsWrittenAndTheirAnswersComeBackOneLineEach(t *testing.T) {
	initialize := `{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18"}}`
	list := `{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}`
	read, sent := relayed(t, initialize+"\n"+list+"\n", func(body string) (Answer, error) {
		if strings.Contains(body, "initialize") {
			return Answer{Status: 200, Body: []byte(`{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2025-06-18"}}`)}, nil
		}

		return Answer{Status: 200, Body: []byte("{\"jsonrpc\":\"2.0\",\n \"id\":2,\"result\":{\"tools\":[]}}")}, nil
	})

	if len(sent) != 2 || sent[0].body != initialize || sent[1].body != list {
		t.Fatalf("the journal was sent %+v, want the driver's exact bytes", sent)
	}
	if len(sent[0].headers) != 0 || sent[1].headers[protocolVersionHeader] != "2025-06-18" {
		t.Fatalf("the calls carried the headers %v and %v", sent[0].headers, sent[1].headers)
	}
	lines := strings.Split(strings.TrimSpace(read), "\n")
	if len(lines) != 2 || !strings.Contains(lines[1], `"tools":[]`) {
		t.Fatalf("the driver read %q, want one line an answer", read)
	}
}

// A modern frame mirrors its method, the name it calls and its protocol version in the call's headers.
func TestAModernFrameMirrorsItsMethodNameAndVersion(t *testing.T) {
	call := `{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"task list","_meta":{"io.modelcontextprotocol/protocolVersion":"2026-01-01"}}}`
	_, sent := relayed(t, call+"\n", func(string) (Answer, error) {
		return Answer{Status: 200, Body: []byte(`{"jsonrpc":"2.0","id":7,"result":{}}`)}, nil
	})

	want := map[string]string{methodHeader: "tools/call", nameHeader: "task list", protocolVersionHeader: "2026-01-01"}
	for name, value := range want {
		if sent[0].headers[name] != value {
			t.Fatalf("the call's %s is %q, want %q", name, sent[0].headers[name], value)
		}
	}
	if headerValue("naïve") != "=?base64?bmHDr3Zl?=" {
		t.Fatalf("a name that is no plain text travels as %q", headerValue("naïve"))
	}
}

// A request the journal never gets is answered with a JSON-RPC error that says whether to send it again; a
// notification is answered with nothing; a message that is no JSON is refused without a call.
func TestWhatTheJournalNeverGetsIsAnsweredByTheRelay(t *testing.T) {
	request := `{"jsonrpc":"2.0","id":3,"method":"tools/list"}`
	notification := `{"jsonrpc":"2.0","method":"notifications/initialized"}`
	read, sent := relayed(t, request+"\n"+notification+"\nnot json\n", func(string) (Answer, error) {
		return Answer{}, errors.New("connection refused")
	})

	if len(sent) != 2 {
		t.Fatalf("the journal was called %d times, want once a readable frame", len(sent))
	}
	lines := strings.Split(strings.TrimSpace(read), "\n")
	if len(lines) != 2 {
		t.Fatalf("the driver read %q, want one error for the broken line and one for the request", read)
	}
	if !strings.Contains(read, `"code":-32700`) || !strings.Contains(read, `"id":3`) ||
		!strings.Contains(read, `"code":"unavailable","retryable":true`) {
		t.Fatalf("the driver read %q", read)
	}
}

// The journal's refusals without a JSON-RPC body become errors the driver can read, and a cancelled request that
// still waits is dropped without a call.
func TestRefusalsBecomeErrorsAndACancelledWaitingRequestIsDropped(t *testing.T) {
	read, _ := relayed(t, `{"jsonrpc":"2.0","id":4,"method":"tools/list"}`+"\n", func(string) (Answer, error) {
		return Answer{Status: 429, Body: []byte(`{"retry_after_seconds":3}`)}, nil
	})
	if !strings.Contains(read, `"code":"busy"`) || !strings.Contains(read, `"retry_after_seconds":3`) {
		t.Fatalf("a busy journal was passed on as %q", read)
	}

	relay := Relay{Output: &bytes.Buffer{}, Errors: &bytes.Buffer{}, Now: time.Now}
	relay.arrived = sync.NewCond(&relay.mutex)
	relay.admit([]byte(`{"jsonrpc":"2.0","id":5,"method":"tools/list"}`))
	relay.admit([]byte(`{"jsonrpc":"2.0","method":"notifications/cancelled","params":{"requestId":5}}`))
	if len(relay.queue) != 0 {
		t.Fatalf("the cancelled request still waits: %d queued", len(relay.queue))
	}
}
