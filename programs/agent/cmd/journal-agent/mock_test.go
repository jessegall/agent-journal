//go:build mock

package main

import (
	"bytes"
	"context"
	"testing"

	"journal-agent/dockermock"
	"journal-agent/recording"
)

// A container that names its program in its entrypoint and its arguments in its command is answered as the program
// was recorded, with the container's environment.
func TestAContainerWhoseEntrypointNamesTheProgramPrintsItsSignIn(t *testing.T) {
	container := &dockermock.Container{}
	container.Config.Entrypoint = []string{"/usr/local/bin/claude"}
	container.Config.Cmd = []string{"auth", "status", "--json"}
	container.Config.Env = []string{"CLAUDE_CONFIG_DIR=/home/agent/.claude"}
	signIn := recording.Fixture{Output: []recording.OutputChunk{{Stream: "stdout", Bytes: []byte(`{"configDirectory":"{env:CLAUDE_CONFIG_DIR}"}` + "\n")}}}
	programs := programInContainer(mockProgram{"claude", recording.Fixture{}, signIn}, nil)

	program := programs(container)
	if program == nil {
		t.Fatal("the container was not answered as the program")
	}
	var printed bytes.Buffer
	program(context.Background(), container, bytes.NewReader(nil), &printed)

	if printed.String() != "{\"configDirectory\":\"/home/agent/.claude\"}\n" {
		t.Fatalf("printed %q", printed.String())
	}
}
