//go:build mock

package main

import (
	"bytes"
	"context"
	"testing"

	"journal-runner/dockermock"
	"journal-runner/recording"
)

// A container that names its program in its entrypoint and its arguments in its command is answered as the program
// was recorded, with the container's environment.
func TestAContainerWhoseEntrypointNamesTheProgramPrintsItsSignIn(t *testing.T) {
	container := &dockermock.Container{}
	container.Config.Entrypoint = []string{"/usr/local/bin/agent-program"}
	container.Config.Cmd = []string{"auth", "status", "--json"}
	container.Config.Env = []string{"PROGRAM_CONFIG_DIR=/home/agent/.program"}
	signIn := recording.Fixture{Output: []recording.OutputChunk{{Stream: "stdout", Bytes: []byte(`{"configDirectory":"{env:PROGRAM_CONFIG_DIR}"}` + "\n")}}}
	programs := programInContainer(mockProgram{"agent-program", recording.Fixture{}, signIn}, nil)

	program := programs(container)
	if program == nil {
		t.Fatal("the container was not answered as the program")
	}
	var printed bytes.Buffer
	program(context.Background(), container, bytes.NewReader(nil), &printed)

	if printed.String() != "{\"configDirectory\":\"/home/agent/.program\"}\n" {
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
