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

// matcherCases is the same table as the Python tests of HookMatcher in tests/unit/engine/provider/test_hook_matcher.py.
var matcherCases = []struct {
	matcher, value      string
	namesOrRegex, regex bool
}{
	{"Edit", "Edit", true, true},
	{"Edit", "MultiEdit", false, true},
	{"Edit", "NotebookEdit", false, true},
	{"Edit,Write", "Edit", true, false},
	{"Edit,Write", "Write", true, false},
	{"Edit, Write", "Write", true, false},
	{"Edit|Write", "Edit", true, true},
	{"Edit|Write", "Write", true, true},
	{"Edit|Write", "MultiEdit", false, true},
	{"mcp__.*", "mcp__x__y", true, true},
	{"(", "Edit", false, false},
	{"", "Edit", true, true},
	{"*", "Edit", true, true},
}

func TestMatcherExactName(t *testing.T) {
	for _, value := range []string{"Edit", "MultiEdit", "NotebookEdit"} {
		if matcherMatches(namesOrRegex, "Edit", value) != (value == "Edit") {
			t.Fatalf("the matcher Edit read as a name gives %t for %s", !(value == "Edit"), value)
		}
	}
}

func TestMatcherList(t *testing.T) {
	for _, matcher := range []string{"Edit,Write", "Edit|Write", "Edit, Write"} {
		if !matcherMatches(namesOrRegex, matcher, "Edit") || !matcherMatches(namesOrRegex, matcher, "Write") || matcherMatches(namesOrRegex, matcher, "MultiEdit") {
			t.Fatalf("the list %q does not match exactly Edit and Write", matcher)
		}
	}
}

func TestMatcherRegex(t *testing.T) {
	if !matcherMatches(namesOrRegex, "mcp__.*", "mcp__x__y") || matcherMatches(namesOrRegex, "^Edit$", "MultiEdit") {
		t.Fatal("a matcher with other characters is not read as a regex")
	}
}

func TestMatcherInvalidRegexMatchesNothing(t *testing.T) {
	for _, style := range []string{namesOrRegex, "regex"} {
		if matcherMatches(style, "(", "Edit") {
			t.Fatalf("an invalid regex matched under the %s style", style)
		}
	}
}

func TestMatcherRegexStyleKeepsASearch(t *testing.T) {
	if !matcherMatches("regex", "Edit", "MultiEdit") || matcherMatches("regex", "Edit,Write", "Edit") {
		t.Fatal("the regex style does not search a plain name as a regex")
	}
}

func TestMatcherCasesTable(t *testing.T) {
	for _, test := range matcherCases {
		if got := matcherMatches(namesOrRegex, test.matcher, test.value); got != test.namesOrRegex {
			t.Errorf("names_or_regex %q against %q = %t, want %t", test.matcher, test.value, got, test.namesOrRegex)
		}
		if got := matcherMatches("regex", test.matcher, test.value); got != test.regex {
			t.Errorf("regex %q against %q = %t, want %t", test.matcher, test.value, got, test.regex)
		}
	}
}

func TestMatchingUsesTheProgramsStyle(t *testing.T) {
	table := programs.Table{Programs: map[string]programs.Program{
		"claude": {Matchers: map[string]string{"PreToolUse": "tool_name"}, MatcherStyle: namesOrRegex},
		"codex":  {Matchers: map[string]string{"PreToolUse": "tool_name"}, MatcherStyle: "regex"},
	}}
	for program, want := range map[string]int{"claude": 0, "codex": 1} {
		hook := ManagedHook{ID: "edit", Program: program, Event: "PreToolUse", Matcher: "Edit", State: "on"}
		if matched := Matching([]ManagedHook{hook}, program, "PreToolUse", []byte(`{"tool_name":"MultiEdit"}`), table); len(matched) != want {
			t.Fatalf("%s matched %d hooks named Edit on MultiEdit, want %d", program, len(matched), want)
		}
	}
}
