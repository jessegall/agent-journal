package programs

import (
	"os"
	"path/filepath"
	"testing"
)

func TestTheShippedTableReadsAndNamesBothPrograms(t *testing.T) {
	table := LoadTable("")
	for _, name := range []string{"claude", "codex"} {
		if _, listed := table.Programs[name]; !listed {
			t.Fatalf("the shipped program table has no row for %s", name)
		}
	}
}

func TestTheTableReadsRecordedMatcherFields(t *testing.T) {
	table := LoadTable("")
	for _, name := range []string{"claude", "codex"} {
		matchers := table.Programs[name].Matchers
		for event, field := range map[string]string{"PreToolUse": "tool_name", "PostToolUse": "tool_name", "SessionStart": "source", "SessionEnd": "reason"} {
			if matchers[event] != field {
				t.Fatalf("%s %s matcher field = %q, want %q", name, event, matchers[event], field)
			}
		}
		if _, exists := matchers["Stop"]; exists {
			t.Fatalf("%s Stop has no recorded matcher field", name)
		}
	}
	if table.Programs["claude"].Matchers["PreCompact"] != "trigger" {
		t.Fatal("program-specific recorded matcher fields were lost")
	}
}

func TestAProjectTablesRowReplacesTheShippedOne(t *testing.T) {
	project := filepath.Join(t.TempDir(), "programs.json")
	os.WriteFile(project, []byte(`{"programs": {"claude": {"events": {"Stop": "stop"}, "decoder": "common"}, "sample": {"events": {"End": "stop"}, "decoder": "common"}}}`), 0o644)
	table := LoadTable(project)
	if len(table.Programs["claude"].Events) != 1 || table.Programs["sample"].Events["End"] != "stop" || table.Programs["codex"].Decoder != "codex" {
		t.Fatalf("the project table was not laid over the shipped one: %+v", table.Programs)
	}
}

func TestAProgramNamingAnUnknownDecoderIsRefused(t *testing.T) {
	context := testContext
	context.Programs = Table{Programs: map[string]Program{"odd": {Events: map[string]string{"Stop": "stop"}, Decoder: "odd"}}}
	if _, _, err := Prepared("odd", []byte(`{"hook_event_name": "Stop", "session_id": "s"}`), context); err == nil {
		t.Fatal("a program naming a decoder this journal-hook does not have was not refused")
	}
}

func TestEveryDecoderHasAShippedRowUsingIt(t *testing.T) {
	used := map[string]bool{}
	for _, program := range LoadTable("").Programs {
		used[program.Decoder] = true
	}
	for name := range decoders {
		if !used[name] {
			t.Errorf("no shipped program uses the decoder %s", name)
		}
	}
}

func TestTheTableReadsMatcherStyleAndLimits(t *testing.T) {
	table := LoadTable("")
	for name, want := range map[string]Program{
		"claude": {MatcherStyle: "names_or_regex", DefaultHookSeconds: 600, SessionEndLimitSeconds: 60},
		"codex":  {MatcherStyle: "regex", DefaultHookSeconds: 600, SessionEndLimitSeconds: 3},
	} {
		got := table.Programs[name]
		if got.MatcherStyle != want.MatcherStyle || got.DefaultHookSeconds != want.DefaultHookSeconds || got.SessionEndLimitSeconds != want.SessionEndLimitSeconds {
			t.Fatalf("%s reads matcher style %q, default %d s, SessionEnd limit %d s; want %+v", name, got.MatcherStyle, got.DefaultHookSeconds, got.SessionEndLimitSeconds, want)
		}
	}
}

func TestTheTableReadsTheWakeAnswer(t *testing.T) {
	table := LoadTable("")
	if table.Programs["claude"].WakeAnswer != "exit_with_stderr" || table.Programs["codex"].WakeAnswer != "" {
		t.Fatalf("claude wakes by %q and codex by %q", table.Programs["claude"].WakeAnswer, table.Programs["codex"].WakeAnswer)
	}
}
