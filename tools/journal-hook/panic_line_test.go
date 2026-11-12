package main

import (
	"context"
	"encoding/json"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

const blockText = "every command is held by a block"

func shellBody(command string) []byte {
	body, _ := json.Marshal(map[string]any{"hook_event_name": "PreToolUse", "session_id": "s-1", "tool_name": "Bash", "tool_input": map[string]string{"command": command}})
	return body
}

// builtJournal builds the journal command line program, whose panic command the agent runs.
func builtJournal(t *testing.T) string {
	t.Helper()
	binary := filepath.Join(t.TempDir(), "journal")
	build, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()
	command := exec.CommandContext(build, "go", "build", "-o", binary, ".")
	command.Dir = filepath.Join("..", "journal")
	command.Env = append(os.Environ(), "CGO_ENABLED=0")
	if output, err := command.CombinedOutput(); err != nil {
		t.Fatalf("go build journal: %v\n%s", err, output)
	}
	return binary
}

func TestOnlyJournalPanicAloneIsAPanicLine(t *testing.T) {
	for _, command := range []string{`journal panic "the journal refuses everything"`, "/usr/local/bin/journal panic locked database", "  journal panic why  ", "journal panic"} {
		if !IsPanicLine(shellBody(command)) {
			t.Errorf("%q should go through as a panic line", command)
		}
	}
	for _, command := range []string{"journal task list", "journal panicky", "journal panic x; rm -rf .", "journal panic x && cat secrets", "journal panic x | tee out",
		"journal panic $(cat file)", "journal panic x > .journal/other", "echo journal panic", "journal panic x\nrm file"} {
		if IsPanicLine(shellBody(command)) {
			t.Errorf("%q must not go through as a panic line", command)
		}
	}
	if IsPanicLine([]byte(`{"hook_event_name":"PreToolUse","tool_input":{"file_path":"journal panic"}}`)) || IsPanicLine([]byte("not json")) {
		t.Error("a hook with no shell command went through as a panic line")
	}
}

func TestABlockedMainAgentRunsJournalPanicAndItsNextCommandPassesWithTheServerUnreachable(t *testing.T) {
	var asked atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		asked.Add(1)
		writer.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(writer).Encode(Reply{Refusal: blockText})
	}))
	_, port, err := net.SplitHostPort(server.Listener.Addr().String())
	if err != nil {
		t.Fatal(err)
	}
	root := project(t, port)
	hook := builtHook(t)
	variables := []string{"AGENT_JOURNAL_ACTIVE=1", "JOURNAL_ENV=scratch"}

	if stdout, _ := run(t, hook, root, shellBody("cat cart.py"), variables...); !strings.Contains(stdout, blockText) {
		t.Fatalf("the block did not refuse the command: %s", stdout)
	}
	askedBefore := asked.Load()
	panicLine := `journal panic "the journal refuses every command"`
	if stdout, code := run(t, hook, root, shellBody(panicLine), variables...); code != 0 || strings.Contains(stdout, blockText) || !strings.Contains(stdout, PanicLineNote) {
		t.Fatalf("the panic line was not let through: exit %d, %s", code, stdout)
	}
	if asked.Load() != askedBefore {
		t.Fatal("the hook asked the server about the panic line")
	}

	server.Close()
	command := exec.Command(builtJournal(t), "panic", "the journal refuses every command")
	command.Env = append(os.Environ(), "JOURNAL_HOME="+filepath.Join(root, ".journal"))
	if output, err := command.CombinedOutput(); err != nil || !strings.Contains(string(output), "panic file written") {
		t.Fatalf("journal panic with the server unreachable: %v\n%s", err, output)
	}
	if PanicReason(root) != "the journal refuses every command" {
		t.Fatalf("the panic file gives the reason %q", PanicReason(root))
	}

	if stdout, code := run(t, hook, root, shellBody("cat cart.py"), variables...); code != 0 || strings.Contains(stdout, blockText) || !strings.Contains(stdout, "panic mode is on") {
		t.Fatalf("the next command did not pass: exit %d, %s", code, stdout)
	}
}

func TestAWorkersJournalPanicLineStaysChecked(t *testing.T) {
	if IsMainRole("worker") || IsMainRole("helper") || !IsMainRole("main") || !IsMainRole("") {
		t.Fatal("only the main agent may panic out of the journal")
	}
}
