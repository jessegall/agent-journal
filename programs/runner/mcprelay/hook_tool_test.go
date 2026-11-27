package mcprelay

import (
	"bytes"
	"context"
	"errors"
	"io"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-runner/hookadapter"
)

// lines is the relay's output, kept safely while the relay writes it from several goroutines.
type lines struct {
	mutex  sync.Mutex
	buffer bytes.Buffer
}

func (written *lines) Write(line []byte) (int, error) {
	written.mutex.Lock()
	defer written.mutex.Unlock()
	return written.buffer.Write(line)
}

func (written *lines) text() string {
	written.mutex.Lock()
	defer written.mutex.Unlock()
	return written.buffer.String()
}

// relayed runs a relay over the frames given, with the sender and hook answerer given, and answers what it wrote and
// how many frames reached the journal.
func relayed(t *testing.T, frames string, send Sender, hook HookAnswerer) (string, int) {
	t.Helper()
	sent := 0
	var counting sync.Mutex
	output := &lines{}
	relay := Relay{Output: output, Errors: io.Discard, Hook: hook,
		Send: func(ctx context.Context, body []byte, issuedAt time.Time, headers map[string]string) (Answer, error) {
			counting.Lock()
			sent++
			counting.Unlock()
			return send(ctx, body, issuedAt, headers)
		}}
	relay.Run(context.Background(), strings.NewReader(frames))
	return output.text(), sent
}

func journalAway(context.Context, []byte, time.Time, map[string]string) (Answer, error) {
	return Answer{}, errors.New("connection refused")
}

const hookCall = `{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"hook","arguments":` +
	`{"hook_event_name":"PreToolUse","tool_name":"exec_command"}}}` + "\n"

func TestAHookCallIsAnsweredByTheAdapterAndNeverSentToTheJournal(t *testing.T) {
	var asked string
	hook := func(native []byte) hookadapter.Reply {
		asked = string(native)
		return hookadapter.Reply{Stdout: `{"decision":"block","reason":"not now"}`}
	}

	written, sent := relayed(t, hookCall, journalAway, hook)

	if sent != 0 || asked != `{"hook_event_name":"PreToolUse","tool_name":"exec_command"}` {
		t.Fatalf("the hook was sent %d times and asked %s", sent, asked)
	}
	want := `{"id":7,"jsonrpc":"2.0","result":{"content":[{"text":"{\"decision\":\"block\",\"reason\":\"not now\"}",` +
		`"type":"text"}],"isError":false}}`
	if strings.TrimSpace(written) != want {
		t.Fatalf("the hook was answered %s", written)
	}
}

func TestAHookThatDidNotPassIsAnErrorResultWithItsStandardError(t *testing.T) {
	hook := func([]byte) hookadapter.Reply { return hookadapter.Reply{Stderr: "no such event\n", ExitCode: 2} }

	written, _ := relayed(t, hookCall, journalAway, hook)

	if !strings.Contains(written, `"isError":true`) || !strings.Contains(written, `no such event\n`) {
		t.Fatalf("a refused hook was answered %s", written)
	}
}

func TestAnInitializeTheJournalDoesNotAnswerIsCompletedByTheRelay(t *testing.T) {
	frames := `{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18",` +
		`"capabilities":{},"clientInfo":{"name":"driver","version":"1"}}}` + "\n" + hookCall
	hook := func([]byte) hookadapter.Reply { return hookadapter.Reply{Stdout: "{}"} }

	written, _ := relayed(t, frames, journalAway, hook)

	if !strings.Contains(written, `"id":1,"jsonrpc":"2.0","result":{"capabilities":{"tools":{}},"protocolVersion":"2025-06-18"`) {
		t.Fatalf("the initialize was answered %s", written)
	}
	if !strings.Contains(written, `"id":7`) {
		t.Fatalf("the hook after a local initialize was not answered: %s", written)
	}
}

func TestACancelledHookCallIsNotAnswered(t *testing.T) {
	release := make(chan struct{})
	hook := func([]byte) hookadapter.Reply {
		<-release
		return hookadapter.Reply{Stdout: "{}"}
	}
	cancel := `{"jsonrpc":"2.0","method":"notifications/cancelled","params":{"requestId":7}}` + "\n"
	reader, writer := io.Pipe()
	output := &lines{}
	relay := Relay{Output: output, Errors: io.Discard, Hook: hook, Send: journalAway}
	done := make(chan struct{})
	go func() {
		relay.Run(context.Background(), reader)
		close(done)
	}()

	_, _ = writer.Write([]byte(hookCall))
	_, _ = writer.Write([]byte(cancel))
	time.Sleep(50 * time.Millisecond)
	close(release)
	_ = writer.Close()
	<-done

	if output.text() != "" {
		t.Fatalf("a cancelled hook was answered %s", output.text())
	}
}

func TestASlowHookHoldsUpNoToolCall(t *testing.T) {
	release := make(chan struct{})
	hook := func([]byte) hookadapter.Reply {
		<-release
		return hookadapter.Reply{Stdout: "{}"}
	}
	tool := `{"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"tasks_assigned","arguments":{}}}` + "\n"
	answered := func(context.Context, []byte, time.Time, map[string]string) (Answer, error) {
		defer close(release)
		return Answer{Status: 200, Body: []byte(`{"jsonrpc":"2.0","id":8,"result":{}}`)}, nil
	}

	written, _ := relayed(t, hookCall+tool, answered, hook)

	if strings.Index(written, `"id":8`) > strings.Index(written, `"id":7`) {
		t.Fatalf("the tool call waited for the hook: %s", written)
	}
}
