package launch

import (
	"errors"
	"strings"
	"testing"
)

func TestTheCommandJournalReadsEveryEnvironmentInOneRequest(t *testing.T) {
	var requests []string
	journal := CommandJournal{Run: func(argv ...string) (string, error) {
		requests = append(requests, strings.Join(argv, " "))
		return `{"rows": [{"id": 1, "name": "main", "folder": "/work/shop", "branch": "main", "suite": "coding", "main_running": true}, {"id": 2, "name": "second", "folder": "/work/two", "branch": "two", "suite": "coding", "main_running": false}]}`, nil
	}}
	environments, err := journal.Environments()
	if err != nil || len(environments) != 2 || environments[0] != (Environment{ID: 1, Name: "main", Folder: "/work/shop", Branch: "main", Suite: "coding", Working: true}) || environments[1].Working {
		t.Fatalf("the environments read are %+v, %v", environments, err)
	}
	if len(requests) != 1 || requests[0] != "environment menu --json" {
		t.Fatalf("the journal was asked %v", requests)
	}
}

func TestTheCommandJournalStopsTheRunningMainsItIsToldOfPastAThousandAgents(t *testing.T) {
	var requests []string
	journal := CommandJournal{Run: func(argv ...string) (string, error) {
		requests = append(requests, strings.Join(argv, " "))
		if argv[1] == "running-main-agents" {
			return `{"rows": [{"id": 1205}]}`, nil
		}
		return "", nil
	}}
	if err := journal.StopMainAgent("main"); err != nil {
		t.Fatal(err)
	}
	wanted := []string{"agent running-main-agents --environment main --json", "agent stop row:1205 --environment main"}
	if strings.Join(requests, "; ") != strings.Join(wanted, "; ") {
		t.Fatalf("the journal was asked %v", requests)
	}
}

func TestTheCommandJournalKeepsTheOrderOfTheMainSessions(t *testing.T) {
	journal := CommandJournal{Run: func(argv ...string) (string, error) {
		switch strings.Join(argv, " ") {
		case "agent main-sessions claude --environment main --json":
			return `{"rows": [{"session": "s-new"}, {"session": "s-old"}]}`, nil
		case "helper cold-sessions claude --environment main --json":
			return `{"rows": [{"session": "s-old", "context_percent": 60}]}`, nil
		}
		t.Fatalf("the journal was asked %v", argv)
		return "", nil
	}}
	conversations, err := journal.Conversations("main", "claude")
	if err != nil || len(conversations) != 2 || conversations[0].Session != "s-new" || conversations[0].ColdPercent != 0 || conversations[1].ColdPercent != 60 {
		t.Fatalf("the conversations read are %+v, %v", conversations, err)
	}
}

func TestTheCommandJournalDeletesAnEnvironmentByItsRowNumber(t *testing.T) {
	var requests []string
	journal := CommandJournal{Run: func(argv ...string) (string, error) {
		requests = append(requests, strings.Join(argv, " "))
		return "", nil
	}}
	if err := journal.DeleteEnvironment(Environment{ID: 7, Name: "checkout"}); err != nil || len(requests) != 1 || requests[0] != "environment delete 7" {
		t.Fatalf("the journal was asked %v, %v", requests, err)
	}
}

func TestACodexLaunchNamesTheTrustStepOnlyWhenItsHooksAreUntrustedOrChanged(t *testing.T) {
	for trust, lineWanted := range map[string]bool{"untrusted": true, "changed": true, "ready": false, "unwritten": false} {
		if line := HookTrustLine(trust); (line != "") != lineWanted || (lineWanted && !strings.Contains(line, "/hooks")) {
			t.Fatalf("hook trust %s gave the line %q", trust, line)
		}
	}
}

func TestProgramCommandReadsArgumentsAndVariables(t *testing.T) {
	var requests []string
	journal := CommandJournal{Run: func(argv ...string) (string, error) {
		requests = append(requests, strings.Join(argv, " "))
		return `{"arguments": ["codex", "--no-daemon"], "variables": {"CODEX_HOME": "/work/shop/.journal/programs/codex"}}`, nil
	}}
	command, err := journal.ProgramCommand(Request{Program: "codex"}, Choice{Folder: "/work/shop", SkipPrompts: true}, "launch-1")
	if err != nil || strings.Join(command.Arguments, " ") != "codex --no-daemon" || command.Variables["CODEX_HOME"] != "/work/shop/.journal/programs/codex" {
		t.Fatalf("the command read is %+v, %v", command, err)
	}
	if len(requests) != 1 || requests[0] != "program command codex /work/shop --launch launch-1 --format json" {
		t.Fatalf("the journal was asked %v", requests)
	}
}

func TestProgramCommandFallsBackToLinesForAnOlderJournal(t *testing.T) {
	var requests []string
	journal := CommandJournal{Run: func(argv ...string) (string, error) {
		requests = append(requests, strings.Join(argv, " "))
		if argv[len(argv)-1] == "json" {
			return "", errors.New("unrecognized arguments: --format json")
		}
		return "claude\n--model\nopus\n", nil
	}}
	command, err := journal.ProgramCommand(Request{Program: "claude"}, Choice{Folder: "/work/shop", SkipPrompts: true}, "launch-1")
	if err != nil || strings.Join(command.Arguments, " ") != "claude --model opus" || len(command.Variables) != 0 {
		t.Fatalf("the command read is %+v, %v", command, err)
	}
	if len(requests) != 2 || requests[1] != "program command claude /work/shop --launch launch-1" {
		t.Fatalf("the journal was asked %v", requests)
	}
}
