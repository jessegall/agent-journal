//go:build !windows

package main

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

var hookProgram = programs.Program{
	Events:     map[string]string{"PreToolUse": "pre_tool_use", "Stop": "stop"},
	Refusals:   map[string]string{"pre_tool_use": "deny", "stop": "block"},
	LineEvents: []string{"pre_tool_use"},
}

const refusingStdout = `{"hookSpecificOutput":{"permissionDecision":"deny","permissionDecisionReason":"no writes here"}}`

func answeredOutput(t *testing.T, status int, answer string, runs ...ForeignRun) string {
	t.Helper()
	var stdout, stderr strings.Builder
	Answered(&stdout, &stderr, hookProgram, "PreToolUse", "pre_tool_use", status, []byte(answer), t.TempDir(), 5*time.Second, runs...)
	return stdout.String()
}

func TestAnUncheckedAnswerKeepsAProjectHooksRefusal(t *testing.T) {
	run := ForeignRun{ID: "guard", Stdout: refusingStdout}
	for name, answer := range map[string]string{
		"stale registry": `{"refusal":"","lines":["the journal let this through unchecked: modules changed"],"hook_call_id":null}`,
		"unknown agent":  `{"refusal":"","lines":[],"hook_call_id":null}`,
	} {
		t.Run(name, func(t *testing.T) {
			if text := answeredOutput(t, http.StatusOK, answer, run); !strings.Contains(text, `"permissionDecision":"deny"`) || !strings.Contains(text, "no writes here") {
				t.Fatalf("the refusal was lost: %s", text)
			}
		})
	}
}

func TestARefusalTheRulesAlreadyReadIsNotAddedTwice(t *testing.T) {
	text := answeredOutput(t, http.StatusOK, `{"refusal":"","lines":[],"hook_call_id":7}`, ForeignRun{ID: "guard", Stdout: refusingStdout})
	if strings.Contains(text, "deny") {
		t.Fatalf("a reply of the journal's rules was changed: %s", text)
	}
}

func TestAnUncheckedAnswerKeepsAProjectHooksLinesAndNewInput(t *testing.T) {
	context := ForeignRun{ID: "note", Stdout: `{"hookSpecificOutput":{"additionalContext":"read the notes"}}`}
	if text := answeredOutput(t, http.StatusOK, `{"hook_call_id":null}`, context); !strings.Contains(text, "read the notes") {
		t.Fatalf("the line was lost: %s", text)
	}
	rewrite := ForeignRun{ID: "rewrite", Stdout: `{"hookSpecificOutput":{"updatedInput":{"command":"ls"}}}`}
	if text := answeredOutput(t, http.StatusOK, `{"hook_call_id":null}`, rewrite); !strings.Contains(text, `"command":"ls"`) {
		t.Fatalf("the input was lost: %s", text)
	}
}

func TestARefusalBesideAProjectHooksNewInputKeepsTheToolFromRunning(t *testing.T) {
	refusal := ForeignRun{ID: "guard", Stdout: refusingStdout}
	rewrite := ForeignRun{ID: "rewrite", Stdout: `{"hookSpecificOutput":{"updatedInput":{"command":"ls"}}}`}
	for name, runs := range map[string][]ForeignRun{"refusal first": {refusal, rewrite}, "rewrite first": {rewrite, refusal}} {
		t.Run(name, func(t *testing.T) {
			text := answeredOutput(t, http.StatusOK, `{"hook_call_id":null}`, runs...)
			if !strings.Contains(text, `"permissionDecision":"deny"`) || strings.Contains(text, "updatedInput") {
				t.Fatalf("the tool would run with the new input: %s", text)
			}
		})
	}
}

func TestARestartTimeoutBesideAProjectHooksNewInputKeepsTheToolFromRunning(t *testing.T) {
	rewrite := ForeignRun{ID: "rewrite", Stdout: `{"hookSpecificOutput":{"updatedInput":{"command":"ls"}}}`}
	text := answeredOutput(t, restartTimedOut, "", rewrite)
	if !strings.Contains(text, `"permissionDecision":"deny"`) || strings.Contains(text, "updatedInput") {
		t.Fatalf("the tool would run after its refusal said it did not: %s", text)
	}
}

func TestPlainOutputIsALineOnTheEventsTheProgramTakesItOn(t *testing.T) {
	program := programs.Program{Events: map[string]string{"SessionStart": "session_start"}, PlainOutput: []string{"session_start"}, LineEvents: []string{"session_start"}}
	run := ForeignRun{ID: "note", Stdout: "read the notes\n"}
	if reply := foreignReply(program, "session_start", []ForeignRun{run}); len(reply.Lines) != 1 || reply.Lines[0] != "read the notes" {
		t.Fatalf("reply = %+v", reply)
	}
	if reply := foreignReply(program, "stop", []ForeignRun{run}); len(reply.Lines) != 0 || reply.Terminal != "note: hook answer must be a JSON object" {
		t.Fatalf("reply = %+v", reply)
	}
}

func managedProject(t *testing.T, command string) string {
	t.Helper()
	root := t.TempDir()
	folder := filepath.Join(root, ".journal", "hooks")
	if err := os.MkdirAll(folder, 0o755); err != nil {
		t.Fatal(err)
	}
	hooks := `{"version":1,"hooks":[{"id":"guard","program":"claude","event":"PreToolUse","command":"` + command + `","timeout":5,"state":"on"}]}`
	if err := os.WriteFile(filepath.Join(folder, "managed.json"), []byte(hooks), 0o644); err != nil {
		t.Fatal(err)
	}
	return root
}

func TestAProjectHookRunsAndRefusesInASessionTheJournalDoesNotHandle(t *testing.T) {
	root := managedProject(t, "echo no writes here >&2; exit 2")
	var stdout, stderr strings.Builder
	body := strings.NewReader(`{"hook_event_name":"PreToolUse","tool_name":"Bash"}`)
	code := projectHooksOnly("claude", root, body, &stdout, &stderr)
	if answer := stdout.String(); code != 0 || !strings.Contains(answer, `"permissionDecision":"deny"`) || !strings.Contains(answer, "no writes here") {
		t.Fatalf("code = %d, answer = %s", code, answer)
	}
}

func TestAProjectWithNoManagedHooksAnswersNothingInASessionTheJournalDoesNotHandle(t *testing.T) {
	var stdout, stderr strings.Builder
	code := projectHooksOnly("claude", t.TempDir(), strings.NewReader("{}"), &stdout, &stderr)
	if code != 0 || stdout.String() != "" || stderr.String() != "" {
		t.Fatalf("code = %d, stdout = %s, stderr = %s", code, stdout.String(), stderr.String())
	}
}

func TestASkippedEventsRefusalIsAnswered(t *testing.T) {
	var stdout, stderr strings.Builder
	code := foreignAnswered(&stdout, &stderr, hookProgram, "PreToolUse", []ForeignRun{{ID: "guard", ExitCode: 2, Stderr: "no writes here"}})
	if code != 0 || !strings.Contains(stdout.String(), "no writes here") {
		t.Fatalf("code = %d, stdout = %s", code, stdout.String())
	}
}
