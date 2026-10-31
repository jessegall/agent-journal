package main

import (
	"encoding/json"
	"testing"
)

func TestTheRequestCarriesTheCommandLineTheCallerVariablesAndTheFolderButNoPid(t *testing.T) {
	variables := map[string]string{"JOURNAL_AGENT_SESSION": "s-1", "USER": "ada", "SECRET_TOKEN": "x"}
	lookup := func(name string) (string, bool) { value, found := variables[name]; return value, found }
	body, err := NewCliRequest([]string{"task", "list"}, lookup, "/work").Body()
	if err != nil {
		t.Fatal(err)
	}
	var decoded map[string]any
	if err := json.Unmarshal(body, &decoded); err != nil {
		t.Fatal(err)
	}
	want := `{"argv":["task","list"],"folder":"/work","variables":{"JOURNAL_AGENT_SESSION":"s-1","USER":"ada"}}`
	if got, _ := json.Marshal(decoded); string(got) != want {
		t.Fatalf("body %s, want %s", got, want)
	}
}

func TestAnEmptyCommandLineIsSentAsAnEmptyList(t *testing.T) {
	body, _ := NewCliRequest(nil, func(string) (string, bool) { return "", false }, "").Body()
	if string(body) != `{"argv":[],"variables":{},"folder":""}` {
		t.Fatalf("body %s", body)
	}
}
