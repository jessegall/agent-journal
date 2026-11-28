//go:build mock

package main

import (
	"bytes"
	"context"
	"strings"
	"testing"

	"journal-runner/dockermock"
	"journal-runner/recorded"
	"journal-runner/recording"
)

// A container that names its program in its entrypoint and its arguments in its command is answered as the program
// was recorded, with the container's environment.
func TestAContainerWhoseEntrypointNamesTheProgramPrintsItsSignIn(t *testing.T) {
	signIn := recorded.MustProbe(t, "claude-code", "auth-status")
	container := &dockermock.Container{}
	container.Config.Entrypoint = []string{"/usr/local/bin/claude"}
	container.Config.Cmd = []string{"auth", "status", "--json"}
	configDirectory := "/home/agent/.claude"
	container.Config.Env = []string{"CLAUDE_CONFIG_DIR=" + configDirectory}
	programs := programInContainer(mockProgram{"claude", recording.Fixture{}, signIn}, nil)

	program := programs(container)
	if program == nil {
		t.Fatal("the container was not answered as the program")
	}
	var printed bytes.Buffer
	program(context.Background(), container, bytes.NewReader(nil), &printed)

	if !strings.Contains(printed.String(), configDirectory) || printed.String() != signIn.Printed(variablesOf(container.Config.Env)) {
		t.Fatalf("printed %q", printed.String())
	}
}

// A container brought back by its restart policy runs a shell that runs the program, so its tty session still plays.
func TestAContainerWhoseShellRunsTheProgramPlaysTheSession(t *testing.T) {
	container := &dockermock.Container{}
	container.Config.Tty = true
	container.Config.Cmd = []string{"/bin/sh", "-c",
		`if find "$1" -name "$2" -print -quit | grep -q .; then exec 'agent-program' '--resume' 'a'; fi; exec 'agent-program' '--session-id' 'a'`,
		"journal-session", "/home/agent/projects", "*a.jsonl"}
	session := dockermock.RecordedProgramOf(t, "claude-code", "terminal-turn", "/bin/sh")
	programs := programInContainer(mockProgram{"agent-program", recording.Fixture{}, recording.Fixture{}}, session.Run)

	program := programs(container)
	if program == nil {
		t.Fatal("the container's shell was not answered as the program's session")
	}
	var printed bytes.Buffer
	program(context.Background(), container, bytes.NewReader(nil), &printed)

	if printed.String() != session.PrintedBefore(0) {
		t.Fatalf("printed %q", printed.String())
	}
}
