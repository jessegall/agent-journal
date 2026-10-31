package programs

import (
	"testing"
)

func TestEveryRecordedClaudeBodyGivesItsObject(t *testing.T) {
	checkRecordings(t, "claude")
}

func TestASubagentsOwnHookIsSkippedAndItsToolUsesAndStopGoOn(t *testing.T) {
	cases := map[string]bool{
		`{"hook_event_name":"Stop","session_id":"s","agent_id":"a1"}`:                                  true,
		`{"hook_event_name":"UserPromptSubmit","session_id":"s","agent_id":"a1","prompt":"x"}`:         true,
		`{"hook_event_name":"PreToolUse","session_id":"s","agent_id":"a1","tool_name":"Read"}`:         false,
		`{"hook_event_name":"PostToolUseFailure","session_id":"s","agent_id":"a1","tool_name":"Bash"}`: false,
		`{"hook_event_name":"SubagentStop","session_id":"s","agent_id":"a1"}`:                          false,
		`{"hook_event_name":"Stop","session_id":"s"}`:                                                  false,
	}
	for body, skipped := range cases {
		prepared, skip, err := Prepared("claude", []byte(body), testContext)
		if err != nil {
			t.Fatalf("%s: %v", body, err)
		}
		if skip != skipped {
			t.Errorf("%s: skip %v, want %v", body, skip, skipped)
		}
		if !skip && prepared.Subagent != "a1" && prepared.Event != "stop" {
			t.Errorf("%s: subagent %q", body, prepared.Subagent)
		}
	}
}

func TestEachClaudeToolHasItsKindAndFiles(t *testing.T) {
	cases := []struct {
		body  string
		kind  string
		files []string
	}{
		{`{"tool_name":"Bash","tool_input":{"command":"ls"}}`, "shell", nil},
		{`{"tool_name":"Monitor","tool_input":{"command":"tail -f log"}}`, "shell", nil},
		{`{"tool_name":"Edit","tool_input":{"file_path":"a.go","old_string":"a","new_string":"b"}}`, "edit", []string{"a.go"}},
		{`{"tool_name":"NotebookEdit","tool_input":{"notebook_path":"n.ipynb","new_source":"x"}}`, "edit", []string{"n.ipynb"}},
		{`{"tool_name":"Write","tool_input":{"file_path":"b.md","content":"x"}}`, "write", []string{"b.md"}},
		{`{"tool_name":"Read","tool_input":{"file_path":"c.py"}}`, "read", []string{"c.py"}},
		{`{"tool_name":"Grep","tool_input":{"pattern":"x","path":"src"}}`, "search", nil},
		{`{"tool_name":"Agent","tool_input":{"prompt":"x"}}`, "agent", nil},
		{`{"tool_name":"mcp__playwright__browser_navigate","tool_input":{"url":"x"}}`, "other", nil},
	}
	for _, sample := range cases {
		body := `{"hook_event_name":"PreToolUse","session_id":"s",` + sample.body[1:]
		prepared, _, err := Prepared("claude", []byte(body), testContext)
		if err != nil {
			t.Fatal(err)
		}
		if prepared.Tool.Kind != sample.kind || len(prepared.Tool.Files) != len(sample.files) || (len(sample.files) == 1 && prepared.Tool.Files[0] != sample.files[0]) {
			t.Errorf("%s gave kind %s files %v", sample.body, prepared.Tool.Kind, prepared.Tool.Files)
		}
	}
}
