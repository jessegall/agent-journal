package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestPreparedHookKeepsTimedOutManagedRuns(t *testing.T) {
	t.Setenv("AGENT_JOURNAL_ACTIVE", "1")
	t.Setenv("JOURNAL_ENV", "scratch")
	root := project(t, "")
	stored, err := json.Marshal(map[string]any{"version": 1, "hooks": []ManagedHook{
		{ID: "expired", Program: "claude", Event: "PreToolUse", Matcher: "Bash", Command: "printf late", Timeout: 0, State: "on"},
	}})
	if err != nil {
		t.Fatal(err)
	}
	writeFile(t, filepath.Join(root, ".journal", "hooks", "managed.json"), string(stored))
	context, skip := hookContext(os.Getenv, root, root, os.Getpid(), time.Now())
	if skip {
		t.Fatal("the journal actor was skipped")
	}
	body := []byte(`{"hook_event_name":"PreToolUse","session_id":"s-1","tool_name":"Bash","tool_input":{"command":"true"}}`)
	prepared, skip, err := preparedHook("claude", root, body, context)
	if err != nil || skip || len(prepared.Foreign) != 1 || !prepared.Foreign[0].TimedOut || prepared.Foreign[0].Stdout != "" {
		t.Fatalf("prepared event = %+v, skip = %t, error = %v", prepared, skip, err)
	}
}

func TestTheHookIsSkippedOrPreparedAsHookShDecides(t *testing.T) {
	started := time.UnixMilli(1793395000123)
	cases := []struct {
		name        string
		variables   map[string]string
		skip        bool
		actor       string
		environment string
	}{
		{"the journal is off", map[string]string{}, true, "", ""},
		{"the journal is on in another way", map[string]string{"AGENT_JOURNAL_ACTIVE": "true"}, true, "", ""},
		{"the agent", map[string]string{"AGENT_JOURNAL_ACTIVE": "1"}, false, "agent", "main"},
		{"the agent named", map[string]string{"AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ACTOR": "agent"}, false, "agent", "main"},
		{"a worker", map[string]string{"AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ACTOR": "worker:12"}, false, "worker:12", "main"},
		{"a verifier", map[string]string{"AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ACTOR": "verifier:3"}, false, "verifier:3", "main"},
		{"a reviewer", map[string]string{"AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ACTOR": "reviewer:4"}, false, "reviewer:4", "main"},
		{"a sub-agent", map[string]string{"AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ACTOR": "sub-agent"}, true, "", ""},
		{"a named environment", map[string]string{"AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "development"}, false, "agent", "development"},
	}
	unrelated := t.TempDir()
	for _, sample := range cases {
		getenv := func(name string) string { return sample.variables[name] }
		context, skip := hookContext(getenv, "/project", unrelated, 7731, started)
		if skip != sample.skip {
			t.Errorf("%s: skip %v, want %v", sample.name, skip, sample.skip)
			continue
		}
		if skip {
			continue
		}
		if context.Actor != sample.actor || context.Environment != sample.environment {
			t.Errorf("%s: actor %q environment %q", sample.name, context.Actor, context.Environment)
		}
		if context.Firing != "7731-1793395000123" || context.FiredAtMs != 1793395000123 {
			t.Errorf("%s: firing %q at %d", sample.name, context.Firing, context.FiredAtMs)
		}
		if context.RunScript != "/project/.journal/src/journal/hooks/run.sh" {
			t.Errorf("%s: run script %q", sample.name, context.RunScript)
		}
	}
}

func TestTheEnvironmentIsTheLinkedWorktreesFolderAndElseMain(t *testing.T) {
	project := t.TempDir()
	writeFile(t, filepath.Join(project, ".git", "HEAD"), "ref: refs/heads/main\n")
	worktreeState := filepath.Join(project, ".git", "worktrees", "feature")
	writeFile(t, filepath.Join(worktreeState, "commondir"), "../..\n")
	worktree := filepath.Join(project, ".journal", "worktrees", "1159-Konrad")
	writeFile(t, filepath.Join(worktree, ".git"), "gitdir: "+worktreeState+"\n")
	submodule := filepath.Join(project, "vendor", "lib")
	writeFile(t, filepath.Join(project, ".git", "modules", "lib", "HEAD"), "ref: refs/heads/main\n")
	writeFile(t, filepath.Join(submodule, ".git"), "gitdir: ../../.git/modules/lib\n")
	cases := map[string]string{
		project:                          "main",
		filepath.Join(project, "src"):    "main",
		worktree:                         "1159-Konrad",
		filepath.Join(worktree, "tools"): "1159-Konrad",
		submodule:                        "main",
		t.TempDir():                      "main",
	}
	for folder, want := range cases {
		if actual := localEnvironment(folder); actual != want {
			t.Errorf("environment of %s = %q, want %q", folder, actual, want)
		}
	}
}

func writeFile(t *testing.T, path, text string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(text), 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestTheHookReadsTheRoleFromTheVariableTheJournalStartedItWith(t *testing.T) {
	variables := map[string]string{"AGENT_JOURNAL_ACTIVE": "1", RoleVariable: "worker"}
	context, skip := hookContext(func(name string) string { return variables[name] }, t.TempDir(), t.TempDir(), 1, time.Now())
	if skip || context.Role != "worker" {
		t.Fatalf("skip %v, role %q", skip, context.Role)
	}
}
