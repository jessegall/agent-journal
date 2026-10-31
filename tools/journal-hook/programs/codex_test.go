package programs

import (
	"strings"
	"testing"
)

func TestEveryRecordedCodexBodyGivesItsObject(t *testing.T) {
	checkRecordings(t, "codex")
}

// Hand-written: the shapes of a Codex shell command the one recorded session does not hold.
func TestACodexShellCommandIsReadBackToTheLineItRuns(t *testing.T) {
	runScript := "/home/a/.journal/src/journal/hooks/run.sh"
	cases := []struct {
		command any
		line    string
	}{
		{"git status", "git status"},
		{[]any{"bash", "-lc", "ls -la && pwd"}, "ls -la && pwd"},
		{[]any{"zsh", "-c", "echo hi"}, "echo hi"},
		{[]any{"git", "log", "--format=%H %s"}, "git log '--format=%H %s'"},
		{"sh " + runScript + " --command 'npm test -- --watch=false'", "npm test -- --watch=false"},
		{"sh /elsewhere/run.sh --command 'npm test'", "sh /elsewhere/run.sh --command 'npm test'"},
		{"None", "None"},
	}
	for _, sample := range cases {
		if got := codexShellLine(sample.command, runScript); got != sample.line {
			t.Errorf("shell line of %v = %q, want %q", sample.command, got, sample.line)
		}
	}
}

// Hand-written: the Codex tools the recorded session did not use.
func TestEachCodexToolHasItsCategoryAndFiles(t *testing.T) {
	cases := []struct {
		body     string
		category string
		files    string
	}{
		{`{"tool_name":"apply_patch","tool_input":{"command":"*** Begin Patch\n*** Update File: a.go\n@@\n-x\n+y\n*** Update File: b.go\n*** Move to: c.go\n*** Update File: a.go\n*** End Patch"}}`, "edit", "a.go b.go c.go"},
		{`{"tool_name":"write_file","tool_input":{"path":"notes.md","content":"x"}}`, "write", "notes.md"},
		{`{"tool_name":"read_file","tool_input":{"file_path":"src/app.py"}}`, "read", "src/app.py"},
		{`{"tool_name":"collaborationspawn_agent","tool_input":{"task_name":"x"}}`, "agent", ""},
		{`{"tool_name":"request_user_input","tool_input":{}}`, "other", ""},
	}
	for _, sample := range cases {
		body := `{"hook_event_name":"PreToolUse","session_id":"s",` + sample.body[1:]
		prepared, skip, err := Prepared("codex", []byte(body), testContext)
		if err != nil || skip {
			t.Fatalf("%s: skip %v, %v", sample.body, skip, err)
		}
		if prepared.Tool.Category != sample.category || strings.Join(prepared.Tool.Files, " ") != sample.files {
			t.Errorf("%s gave category %s files %v", sample.body, prepared.Tool.Category, prepared.Tool.Files)
		}
	}
}

func TestCodexSendsNoMessageOrFailureHooks(t *testing.T) {
	for _, name := range []string{"MessageDisplay", "PostToolUseFailure", "StopFailure"} {
		if _, skip, err := Prepared("codex", []byte(`{"hook_event_name":"`+name+`","session_id":"s"}`), testContext); !skip || err == nil {
			t.Errorf("Codex %s was taken", name)
		}
	}
}
