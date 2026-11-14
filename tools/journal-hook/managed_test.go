package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

func TestLoadManagedHooks(t *testing.T) {
	hook := ManagedHook{ID: "sample:PreToolUse:Bash:abc", Program: "sample", Event: "PreToolUse", Matcher: "Bash", Command: "check", Timeout: 30, Source: "settings.json", Tracked: true, Fields: map[string]any{"statusMessage": "Checking"}, State: "on"}
	data, err := json.Marshal(map[string]any{"version": 1, "hooks": []ManagedHook{hook}})
	if err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(t.TempDir(), "managed.json")
	if err := os.WriteFile(path, data, 0o600); err != nil {
		t.Fatal(err)
	}
	if hooks := LoadManaged(path); !reflect.DeepEqual(hooks, []ManagedHook{hook}) {
		t.Fatalf("loaded hooks = %+v", hooks)
	}
}

func TestLoadManagedMissingUnreadableAndInvalidFiles(t *testing.T) {
	folder := t.TempDir()
	bad := filepath.Join(folder, "bad.json")
	if err := os.WriteFile(bad, []byte(`{"version": 1, "hooks": [`), 0o600); err != nil {
		t.Fatal(err)
	}
	for _, path := range []string{filepath.Join(folder, "missing.json"), folder, bad} {
		if hooks := LoadManaged(path); len(hooks) != 0 {
			t.Fatalf("%s loaded hooks from a missing, unreadable or invalid file", path)
		}
	}
}

func TestMatchingManagedHooks(t *testing.T) {
	table := programs.Table{Programs: map[string]programs.Program{"sample": {Matchers: map[string]string{"PreToolUse": "tool_name"}}}}
	cases := []struct {
		name, matcher, body, event, state, program string
		matches                                    bool
	}{
		{"regex matches", "^(Bash|Read)$", `{"tool_name":"Bash"}`, "PreToolUse", "on", "sample", true},
		{"regex differs", "^Read$", `{"tool_name":"Bash"}`, "PreToolUse", "on", "sample", false},
		{"disabled", "Bash", `{"tool_name":"Bash"}`, "PreToolUse", "off", "sample", false},
		{"different program", "Bash", `{"tool_name":"Bash"}`, "PreToolUse", "on", "different", false},
		{"different event", "Bash", `{"tool_name":"Bash"}`, "Stop", "on", "sample", false},
		{"empty", "", `{}`, "PreToolUse", "on", "sample", true},
		{"star", "*", `{}`, "PreToolUse", "on", "sample", true},
		{"missing body field", "^$", `{}`, "PreToolUse", "on", "sample", false},
		{"non string body field", "42", `{"tool_name":42}`, "PreToolUse", "on", "sample", false},
		{"invalid regex", "[", `{"tool_name":"Bash"}`, "PreToolUse", "on", "sample", false},
		{"invalid body", "Bash", `{`, "PreToolUse", "on", "sample", false},
	}
	for _, test := range cases {
		t.Run(test.name, func(t *testing.T) {
			hook := ManagedHook{ID: test.name, Program: test.program, Event: test.event, Matcher: test.matcher, State: test.state}
			if hooks := Matching([]ManagedHook{hook}, "sample", "PreToolUse", []byte(test.body), table); (len(hooks) == 1) != test.matches {
				t.Fatalf("matching hooks = %+v, want match %t", hooks, test.matches)
			}
		})
	}
}

func TestMatchingWithoutAFieldKeepsHookOrder(t *testing.T) {
	table := programs.Table{Programs: map[string]programs.Program{"sample": {}}}
	hooks := []ManagedHook{
		{ID: "first", Program: "sample", Event: "Stop", Matcher: "unrelated", State: "on"},
		{ID: "disabled", Program: "sample", Event: "Stop", State: "off"},
		{ID: "second", Program: "sample", Event: "Stop", Matcher: "[", State: "on"},
	}
	if matched := Matching(hooks, "sample", "Stop", []byte(`{}`), table); !reflect.DeepEqual(matched, []ManagedHook{hooks[0], hooks[2]}) {
		t.Fatalf("matching hooks = %+v", matched)
	}
}
