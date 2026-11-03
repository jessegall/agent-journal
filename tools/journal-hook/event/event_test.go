package event_test

import (
	"encoding/json"
	"reflect"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/internal/schemacheck"
)

// A HookEvent whose lists were never filled, holding one of every type.
func emptyEvent() event.HookEvent {
	zero := 0
	return event.HookEvent{
		Version: event.Version, Program: "claude", Event: "pre_tool_use", Raw: json.RawMessage(`{}`),
		Tool: &event.Tool{Name: "Bash", Category: "shell", Shell: &event.ShellLine{Parts: []event.Part{
			{Classification: event.Classification{Category: "unknown"}, PipedInto: &zero},
		}}},
	}
}

func TestEachTypeWritesItsEmptyListsAsListsAndFitsTheSchema(t *testing.T) {
	prepared := emptyEvent()
	schemacheck.Fits(t, prepared)
	encoded, _ := json.Marshal(prepared)
	for _, field := range []string{`"files":[]`, `"parts":[{`, `"redirects":[]`, `"arguments":[]`, `"effects":[]`, `"foreign":[]`} {
		if strings.Contains(string(encoded), field) {
			continue
		}
		t.Errorf("%s is missing from %s", field, encoded)
	}
}

func TestForeignHookResultsFitTheSchemaAndRoundTrip(t *testing.T) {
	prepared := emptyEvent()
	prepared.Foreign = []event.ForeignRun{{ID: "check", ExitCode: 2, Stdout: "blocked", Stderr: "details", Milliseconds: 17, TimedOut: true, Answer: event.ForeignAnswer{Lines: []string{}, UpdatedInput: map[string]any{}}}}
	schemacheck.Fits(t, prepared)
	encoded, err := json.Marshal(prepared)
	if err != nil {
		t.Fatal(err)
	}
	var decoded event.HookEvent
	if err := json.Unmarshal(encoded, &decoded); err != nil || !reflect.DeepEqual(decoded.Foreign, prepared.Foreign) {
		t.Fatalf("foreign results did not round trip: %+v, %v", decoded.Foreign, err)
	}
}

func TestTheOptionalFieldsOfAPartAreLeftOutWhenEmpty(t *testing.T) {
	encoded, _ := json.Marshal(event.Part{Classification: event.Classification{Category: "read"}})
	for _, field := range []string{"subcommand", "read_paths", "write_paths", "joined_by", "piped_into"} {
		if !strings.Contains(string(encoded), field) {
			continue
		}
		t.Errorf("an empty %s is written: %s", field, encoded)
	}
}

func TestADiffAndAPromptFitTheSchemaWhereItAllowsThem(t *testing.T) {
	edit := event.HookEvent{Version: event.Version, Program: "codex", Event: "post_tool_use", Raw: json.RawMessage(`{}`),
		Tool: &event.Tool{Name: "apply_patch", Category: "edit", Files: []string{"a.go"}, Diff: &event.DiffCount{Path: "a.go", Existed: true, LinesAdded: 1}}}
	schemacheck.Fits(t, edit)
	items := "go on"
	schemacheck.Fits(t, event.HookEvent{Version: event.Version, Program: "claude", Event: "prompt", Prompt: &items, Raw: json.RawMessage(`{}`)})
}
