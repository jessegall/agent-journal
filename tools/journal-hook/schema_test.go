package main

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/santhosh-tekuri/jsonschema/v6"
)

const schemaFile = "hook_event.schema.json"

// Each wrong shape, made from the document's example by one change.
var wrongShapes = map[string]func(event map[string]any){
	"version 2":                           func(event map[string]any) { event["version"] = json.Number("2") },
	"an unknown program":                  func(event map[string]any) { event["program"] = "cursor" },
	"an agent program's own event name":   func(event map[string]any) { event["event"] = "PreToolUse" },
	"no raw body":                         func(event map[string]any) { delete(event, "raw") },
	"a field the schema does not name":    func(event map[string]any) { event["extra"] = true },
	"fired_at_ms as text":                 func(event map[string]any) { event["fired_at_ms"] = "1793395000123" },
	"a tool event without a tool":         func(event map[string]any) { event["tool"] = nil },
	"a prompt on a tool event":            func(event map[string]any) { event["prompt"] = "go on" },
	"an unknown tool kind":                func(event map[string]any) { tool(event)["kind"] = "browser" },
	"a shell tool without its shell line": func(event map[string]any) { delete(tool(event), "shell") },
	"a read tool with a shell line":       func(event map[string]any) { tool(event)["kind"] = "read" },
	"a diff on a shell tool": func(event map[string]any) {
		tool(event)["diff"] = map[string]any{"path": "a", "existed": true, "lines_added": json.Number("1"), "lines_removed": json.Number("0")}
	},
	"no parse_error":                     func(event map[string]any) { delete(shell(event), "parse_error") },
	"a line kind not in the table":       func(event map[string]any) { shell(event)["kind"] = "browse" },
	"a part joined by a pipe":            func(event map[string]any) { part(event, 0)["joined_by"] = "|" },
	"a part piped into a negative index": func(event map[string]any) { part(event, 1)["piped_into"] = json.Number("-1") },
	"a part without arguments":           func(event map[string]any) { delete(part(event, 2), "arguments") },
	"an effect not in the table": func(event map[string]any) {
		part(event, 0)["classification"] = map[string]any{"kind": "read", "effects": []any{"reads_minds"}}
	},
}

func TestTheSchemaTakesTheDocumentsExampleAndOneOfEachToolKind(t *testing.T) {
	schema := compiledSchema(t)
	examples, _ := filepath.Glob("testdata/schema/*.json")
	kinds := map[string]bool{}
	for _, example := range examples {
		event := readExample(t, example)
		if err := schema.Validate(event); err != nil {
			t.Errorf("%s does not validate: %v", example, err)
		}
		if found, ok := event.(map[string]any)["tool"].(map[string]any); ok {
			kinds[found["kind"].(string)] = true
		}
	}
	for _, kind := range []string{"shell", "edit", "write", "read", "search", "agent", "other"} {
		if !kinds[kind] {
			t.Errorf("no example of the tool kind %s", kind)
		}
	}
}

func TestTheSchemaRefusesEachWrongShape(t *testing.T) {
	schema := compiledSchema(t)
	for name, change := range wrongShapes {
		event := readExample(t, "testdata/schema/document_example.json").(map[string]any)
		change(event)
		if schema.Validate(event) == nil {
			t.Errorf("the schema took %s", name)
		}
	}
}

func compiledSchema(t *testing.T) *jsonschema.Schema {
	t.Helper()
	text, err := os.ReadFile(schemaFile)
	if err != nil {
		t.Fatal(err)
	}
	document, err := jsonschema.UnmarshalJSON(bytes.NewReader(text))
	if err != nil {
		t.Fatal(err)
	}
	compiler := jsonschema.NewCompiler()
	if err := compiler.AddResource(schemaFile, document); err != nil {
		t.Fatal(err)
	}
	schema, err := compiler.Compile(schemaFile)
	if err != nil {
		t.Fatal(err)
	}
	return schema
}

// readExample decodes the way the validator expects: numbers as json.Number.
func readExample(t *testing.T, path string) any {
	t.Helper()
	text, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	decoder := json.NewDecoder(bytes.NewReader(text))
	decoder.UseNumber()
	var event any
	if err := decoder.Decode(&event); err != nil {
		t.Fatalf("%s: %v", path, err)
	}
	return event
}

func tool(event map[string]any) map[string]any {
	return event["tool"].(map[string]any)
}

func shell(event map[string]any) map[string]any {
	return tool(event)["shell"].(map[string]any)
}

func part(event map[string]any, index int) map[string]any {
	return shell(event)["parts"].([]any)[index].(map[string]any)
}
