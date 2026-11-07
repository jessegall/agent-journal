package main

import (
	"encoding/json"
	"testing"
)

func TestTheRequestCarriesTheCommandLineTheCallerVariablesAndTheFolderButNoPid(t *testing.T) {
	variables := map[string]string{"JOURNAL_AGENT_SESSION": "s-1", "USER": "ada", "SECRET_TOKEN": "x"}
	lookup := func(name string) (string, bool) { value, exists := variables[name]; return value, exists }
	body, err := NewCliRequest([]string{"task", "list"}, lookup, "/work").Body()
	if err != nil {
		t.Fatal(err)
	}
	var decoded map[string]any
	if err := json.Unmarshal(body, &decoded); err != nil {
		t.Fatal(err)
	}
	want := `{"argv":["task","list"],"folder":"/work","variables":{"JOURNAL_AGENT_SESSION":"s-1","USER":"ada"}}`
	if actual, _ := json.Marshal(decoded); string(actual) != want {
		t.Fatalf("body %s, want %s", actual, want)
	}
}

func TestAnEmptyCommandLineIsSentAsAnEmptyList(t *testing.T) {
	body, _ := NewCliRequest(nil, func(string) (string, bool) { return "", false }, "").Body()
	if string(body) != `{"argv":[],"variables":{},"folder":""}` {
		t.Fatalf("body %s", body)
	}
}

func TestTheRequestCarriesTheVariableThatSaysARunnerIsAround(t *testing.T) {
	lookup := func(name string) (string, bool) {
		if name == "JOURNAL_RUNNER_PROCESS" {
			return "7", true
		}
		return "", false
	}
	request := NewCliRequest([]string{"sins"}, lookup, "/work")
	if request.Variables["JOURNAL_RUNNER_PROCESS"] != "7" {
		t.Fatalf("the runner variable is not in the request: %v", request.Variables)
	}
}

func TestTheRequestCarriesTheCurrentProcessSeparatelyFromTheRunnerMarker(t *testing.T) {
	variables := map[string]string{"JOURNAL_PROCESS": "12", "JOURNAL_RUNNER_PROCESS": "7"}
	lookup := func(name string) (string, bool) { value, exists := variables[name]; return value, exists }
	request := NewCliRequest([]string{"worker-operation", "run", "3"}, lookup, "/work")
	if request.Variables["JOURNAL_PROCESS"] != "12" || request.Variables["JOURNAL_RUNNER_PROCESS"] != "7" {
		t.Fatalf("the current process and runner marker were not preserved: %v", request.Variables)
	}
}
