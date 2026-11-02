package main

import (
	"reflect"
	"testing"
)

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
