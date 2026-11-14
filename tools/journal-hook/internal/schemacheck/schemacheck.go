// Package schemacheck checks values against hook_event.schema.json in tests.
package schemacheck

import (
	"bytes"
	"encoding/json"
	"sync"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/santhosh-tekuri/jsonschema/v6"
)

var compiled = sync.OnceValues(func() (*jsonschema.Schema, error) {
	document, err := jsonschema.UnmarshalJSON(bytes.NewReader(event.Schema))
	if err != nil {
		return nil, err
	}
	compiler := jsonschema.NewCompiler()
	if err := compiler.AddResource("hook_event.schema.json", document); err != nil {
		return nil, err
	}
	return compiler.Compile("hook_event.schema.json")
})

// Problem says why a value does not fit the schema, or nil when it fits; the value is encoded as JSON first, so a
// HookEvent is checked as the server will read it.
func Problem(t testing.TB, value any) error {
	t.Helper()
	schema, err := compiled()
	if err != nil {
		t.Fatalf("hook_event.schema.json does not compile: %v", err)
	}
	text, err := json.Marshal(value)
	if err != nil {
		t.Fatalf("encoding %T: %v", value, err)
	}
	decoder := json.NewDecoder(bytes.NewReader(text))
	decoder.UseNumber()
	var decoded any
	if err := decoder.Decode(&decoded); err != nil {
		t.Fatal(err)
	}
	return schema.Validate(decoded)
}

// Fits fails the test when the value does not fit the schema.
func Fits(t testing.TB, value any) {
	t.Helper()
	if err := Problem(t, value); err != nil {
		t.Errorf("does not fit hook_event.schema.json: %v", err)
	}
}
