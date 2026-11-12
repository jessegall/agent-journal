package main

import (
	"bytes"
	"errors"
	"reflect"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal/launch"
)

func TestLaunchManagesProjectHooksBeforeTrustAndContinuesAfterFailure(t *testing.T) {
	for _, manageError := range []error{nil, errors.New("cannot save hooks")} {
		var calls [][]string
		journal := launch.CommandJournal{Run: func(arguments ...string) (string, error) {
			calls = append(calls, arguments)
			if arguments[1] == "manage" {
				return "", manageError
			}
			return "trusted", nil
		}}
		var stderr bytes.Buffer
		prepareProgramHooks(journal, "claude", "/project with spaces", &stderr)
		want := [][]string{{"program", "manage", "claude", "/project with spaces"}, {"program", "trust", "claude", "/project with spaces"}}
		if !reflect.DeepEqual(calls, want) {
			t.Fatalf("calls = %v, want %v", calls, want)
		}
	}
}

func TestALaunchTakesTheWorktreeFlagAndKeepsEveryOtherArgumentForTheProgram(t *testing.T) {
	request, err := launchRequest([]string{"claude", "--model", "sonnet", "--worktree", "calm-river", "--effort", "low"})
	if err != nil {
		t.Fatal(err)
	}
	if !request.WorktreeGiven || request.Worktree != "calm-river" {
		t.Fatalf("the worktree is taken by the launch: %+v", request)
	}
	if want := []string{"--model", "sonnet", "--effort", "low"}; !reflect.DeepEqual(request.ProgramArguments, want) {
		t.Fatalf("got %v, want %v", request.ProgramArguments, want)
	}
	bare, err := launchRequest([]string{"claude", "-w", "--model", "sonnet"})
	if err != nil {
		t.Fatal(err)
	}
	if !bare.WorktreeGiven || bare.Worktree != "" || !reflect.DeepEqual(bare.ProgramArguments, []string{"--model", "sonnet"}) {
		t.Fatalf("a bare worktree flag leaves the next flag to the program: %+v", bare)
	}
}

func TestTheJournalCodexHomeOverridesThePersons(t *testing.T) {
	programCommand := launch.ProgramCommand{Arguments: []string{"codex"}, Variables: map[string]string{"CODEX_HOME": "/journal"}}
	command := programExec(programCommand, launch.Choice{Folder: "/work/shop"}, "launch-1", []string{"CODEX_HOME=/person", "PATH=/usr/bin"})
	last := ""
	for _, entry := range command.Env {
		if len(entry) > len("CODEX_HOME=") && entry[:len("CODEX_HOME=")] == "CODEX_HOME=" {
			last = entry
		}
	}
	if last != "CODEX_HOME=/journal" || command.Dir != "/work/shop" {
		t.Fatalf("the program's environment is %v in %s", command.Env, command.Dir)
	}
}
