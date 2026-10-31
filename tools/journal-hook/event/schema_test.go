package event_test

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/internal/schemacheck"
)

const documentExample = "testdata/schema/document_example.json"

// Each wrong shape, made from the document's example by one change.
var wrongShapes = map[string]func(prepared map[string]any){
	"version 2":                           func(prepared map[string]any) { prepared["version"] = json.Number("2") },
	"an unknown program":                  func(prepared map[string]any) { prepared["program"] = "cursor" },
	"an agent program's own event name":   func(prepared map[string]any) { prepared["event"] = "PreToolUse" },
	"no raw body":                         func(prepared map[string]any) { delete(prepared, "raw") },
	"a field the schema does not name":    func(prepared map[string]any) { prepared["extra"] = true },
	"fired_at_ms as text":                 func(prepared map[string]any) { prepared["fired_at_ms"] = "1793395000123" },
	"a tool event without a tool":         func(prepared map[string]any) { prepared["tool"] = nil },
	"a prompt on a tool event":            func(prepared map[string]any) { prepared["prompt"] = "go on" },
	"an unknown tool kind":                func(prepared map[string]any) { tool(prepared)["kind"] = "browser" },
	"a shell tool without its shell line": func(prepared map[string]any) { delete(tool(prepared), "shell") },
	"a read tool with a shell line":       func(prepared map[string]any) { tool(prepared)["kind"] = "read" },
	"no parse_error":                      func(prepared map[string]any) { delete(shell(prepared), "parse_error") },
	"a line kind not in the table":        func(prepared map[string]any) { shell(prepared)["kind"] = "browse" },
	"a part joined by a pipe":             func(prepared map[string]any) { part(prepared, 0)["joined_by"] = "|" },
	"a part piped into a negative index":  func(prepared map[string]any) { part(prepared, 1)["piped_into"] = json.Number("-1") },
	"a part without arguments":            func(prepared map[string]any) { delete(part(prepared, 2), "arguments") },
	"a diff on a shell tool": func(prepared map[string]any) {
		tool(prepared)["diff"] = map[string]any{"path": "a", "existed": true, "lines_added": json.Number("1"), "lines_removed": json.Number("0")}
	},
	"an effect not in the table": func(prepared map[string]any) {
		part(prepared, 0)["classification"] = map[string]any{"kind": "read", "effects": []any{"reads_minds"}}
	},
}

func TestTheSchemaTakesTheDocumentsExampleAndOneOfEachToolCategory(t *testing.T) {
	examples, _ := filepath.Glob("testdata/schema/*.json")
	categories := map[string]bool{}
	for _, example := range examples {
		prepared := readExample(t, example)
		if err := schemacheck.Problem(t, prepared); err != nil {
			t.Errorf("%s does not validate: %v", example, err)
		}
		if found, ok := prepared["tool"].(map[string]any); ok {
			categories[found["kind"].(string)] = true
		}
	}
	for _, category := range []string{"shell", "edit", "write", "read", "search", "agent", "other"} {
		if !categories[category] {
			t.Errorf("no example of the tool category %s", category)
		}
	}
}

func TestTheSchemaRefusesEachWrongShape(t *testing.T) {
	for name, change := range wrongShapes {
		prepared := readExample(t, documentExample)
		change(prepared)
		if schemacheck.Problem(t, prepared) == nil {
			t.Errorf("the schema took %s", name)
		}
	}
}

// Every example read into the Go HookEvent and written out again is the same object and fits the schema, so the Go
// type and the schema name the same fields.
func TestTheHookEventTypeWritesWhatTheSchemaReads(t *testing.T) {
	examples, _ := filepath.Glob("testdata/schema/*.json")
	for _, example := range examples {
		text, err := os.ReadFile(example)
		if err != nil {
			t.Fatal(err)
		}
		var prepared event.HookEvent
		decoder := json.NewDecoder(bytes.NewReader(text))
		decoder.DisallowUnknownFields()
		if err := decoder.Decode(&prepared); err != nil {
			t.Fatalf("%s: %v", example, err)
		}
		schemacheck.Fits(t, prepared)
		written, _ := json.Marshal(prepared)
		var original, again any
		_ = json.Unmarshal(text, &original)
		_ = json.Unmarshal(written, &again)
		if !jsonEqual(original, again) {
			t.Errorf("%s changes when read into HookEvent and written again:\n%s", example, written)
		}
	}
}

func jsonEqual(first, second any) bool {
	one, _ := json.Marshal(first)
	two, _ := json.Marshal(second)
	return bytes.Equal(one, two)
}

func readExample(t *testing.T, path string) map[string]any {
	t.Helper()
	text, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	decoder := json.NewDecoder(bytes.NewReader(text))
	decoder.UseNumber()
	var prepared map[string]any
	if err := decoder.Decode(&prepared); err != nil {
		t.Fatalf("%s: %v", path, err)
	}
	return prepared
}

func tool(prepared map[string]any) map[string]any {
	return prepared["tool"].(map[string]any)
}

func shell(prepared map[string]any) map[string]any {
	return tool(prepared)["shell"].(map[string]any)
}

func part(prepared map[string]any, index int) map[string]any {
	return shell(prepared)["parts"].([]any)[index].(map[string]any)
}
