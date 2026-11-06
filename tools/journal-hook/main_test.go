package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// The binary built without cgo for this machine runs one recorded body: with no journal to answer, it goes on, tells
// Claude so, and notes the hook in bypass.log; with the journal not on, it does nothing.
func builtHook(t *testing.T) string {
	t.Helper()
	binary := filepath.Join(t.TempDir(), "journal-hook")
	build, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()
	command := exec.CommandContext(build, "go", "build", "-o", binary, ".")
	command.Env = append(os.Environ(), "CGO_ENABLED=0")
	if output, err := command.CombinedOutput(); err != nil {
		t.Fatalf("go build: %v\n%s", err, output)
	}
	return binary
}

func TestTheBuiltBinaryRunsARecordedBody(t *testing.T) {
	binary := builtHook(t)
	body := firstLine(t, filepath.Join("testdata", "recorded", "claude", "PreToolUse.jsonl"))
	root := project(t, "")

	stdout, code := run(t, binary, root, body, "AGENT_JOURNAL_ACTIVE=1", "JOURNAL_ENV=scratch")
	if code != 0 || !strings.Contains(stdout, `"hookEventName":"PreToolUse"`) || !strings.Contains(stdout, "did not answer within 5 seconds") {
		t.Errorf("exit %d, printed %q", code, stdout)
	}
	if read(t, filepath.Join(root, ".journal", "runtime", "bypass.log")) == "" || read(t, filepath.Join(root, ".journal", "runtime", "hooks", "scratch.fired")) == "" {
		t.Error("the hook was not stamped and noted")
	}

	inactive := project(t, "")
	if stdout, code := run(t, binary, inactive, body, "AGENT_JOURNAL_ACTIVE=0"); code != 0 || stdout != "" {
		t.Errorf("an inactive project: exit %d, printed %q", code, stdout)
	}
}

func TestTheBuiltBinaryPostsFinishedManagedRuns(t *testing.T) {
	received := make(chan event.HookEvent, 1)
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		var prepared event.HookEvent
		if err := json.NewDecoder(request.Body).Decode(&prepared); err != nil {
			t.Errorf("decode prepared event: %v", err)
			writer.WriteHeader(http.StatusBadRequest)
			return
		}
		received <- prepared
		writer.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(writer).Encode(Reply{Terminal: "project hook diagnostic"})
	}))
	defer server.Close()
	_, port, err := net.SplitHostPort(server.Listener.Addr().String())
	if err != nil {
		t.Fatal(err)
	}
	root := project(t, port)
	hooks := []ManagedHook{
		{ID: "managed", Program: "claude", Event: "PreToolUse", Matcher: "Bash", Command: "printf finished; printf details >&2; exit 7", Timeout: 5, State: "on"},
		{ID: "disabled", Program: "claude", Event: "PreToolUse", Command: "exit 99", Timeout: 5, State: "off"},
		{ID: "expired", Program: "claude", Event: "PreToolUse", Command: "sleep 60", Timeout: 0, State: "on"},
	}
	stored, err := json.Marshal(map[string]any{"version": 1, "hooks": hooks})
	if err != nil {
		t.Fatal(err)
	}
	writeFile(t, filepath.Join(root, ".journal", "hooks", "managed.json"), string(stored))
	body := []byte(`{"hook_event_name":"PreToolUse","session_id":"s-1","tool_name":"Bash","tool_input":{"command":"true"}}`)
	if stdout, code := run(t, builtHook(t), root, body, "AGENT_JOURNAL_ACTIVE=1", "JOURNAL_ENV=scratch"); code != 0 || !strings.Contains(stdout, "project hook diagnostic") {
		t.Fatalf("exit %d: %s", code, stdout)
	}
	select {
	case prepared := <-received:
		if prepared.Version != event.Version || len(prepared.Foreign) != 2 {
			t.Fatalf("prepared event = %+v", prepared)
		}
		run := prepared.Foreign[0]
		if run.ID != "managed" || run.ExitCode != 7 || run.Stdout != "finished" || run.Stderr != "details" || run.TimedOut {
			t.Fatalf("managed run = %+v", run)
		}
		if expired := prepared.Foreign[1]; expired.ID != "expired" || !expired.TimedOut || expired.ExitCode == 0 {
			t.Fatalf("timed out run = %+v", expired)
		}
	default:
		t.Fatal("the fake server received no prepared event")
	}
}

func run(t *testing.T, binary, root string, body []byte, variables ...string) (string, int) {
	t.Helper()
	limit, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	command := exec.CommandContext(limit, binary, "claude", root)
	command.Env = append(os.Environ(), variables...)
	command.Stdin = bytes.NewReader(body)
	output, err := command.Output()
	if exit, present := err.(*exec.ExitError); present {
		return string(output), exit.ExitCode()
	}
	if err != nil {
		t.Fatal(err)
	}
	return string(output), 0
}

func firstLine(t *testing.T, path string) []byte {
	t.Helper()
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	scanner.Scan()
	return append([]byte(nil), scanner.Bytes()...)
}

// runProgram runs the built hook as the program's own hook and gives everything it printed.
func runProgram(t *testing.T, binary, program, root string, body []byte, variables ...string) string {
	t.Helper()
	limit, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	command := exec.CommandContext(limit, binary, program, root)
	command.Env = append(os.Environ(), variables...)
	command.Stdin = bytes.NewReader(body)
	output, _ := command.CombinedOutput()
	return string(output)
}

func TestWithNoServerAWorkerOrHelperRunsNoToolOnAnyProgramAndAMainAgentGoesOn(t *testing.T) {
	binary := builtHook(t)
	for _, program := range []string{"claude", "codex"} {
		body := firstLine(t, filepath.Join("testdata", "recorded", program, "PreToolUse.jsonl"))
		for _, role := range []string{"worker", "helper"} {
			root := project(t, "")
			output := runProgram(t, binary, program, root, body, "AGENT_JOURNAL_ACTIVE=1", "JOURNAL_ENV=scratch", RoleVariable+"="+role)
			if !strings.Contains(output, "this tool did not run") || !strings.Contains(output, "stop and write in your report") {
				t.Errorf("a %s on %s was answered %q", role, program, output)
			}
			if _, err := os.Stat(filepath.Join(root, ".journal", "runtime", "bypass.log")); err == nil {
				t.Errorf("a refused tool of a %s on %s was noted as going around the journal", role, program)
			}
		}
		root := project(t, "")
		output := runProgram(t, binary, program, root, body, "AGENT_JOURNAL_ACTIVE=1", "JOURNAL_ENV=scratch", RoleVariable+"=main")
		if strings.Contains(output, "this tool did not run") || read(t, filepath.Join(root, ".journal", "runtime", "bypass.log")) == "" {
			t.Errorf("a main agent on %s was answered %q", program, output)
		}
	}
}

