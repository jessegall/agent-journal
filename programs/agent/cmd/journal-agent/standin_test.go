//go:build standin

package main

import (
	"bytes"
	"context"
	"testing"

	"journal-agent/dockerstandin"
)

// A container that names its program in its entrypoint and its arguments in its command is answered as the program.
func TestAContainerWhoseEntrypointNamesTheProgramPrintsItsSignIn(t *testing.T) {
	container := &dockerstandin.Container{}
	container.Config.Entrypoint = []string{"/usr/local/bin/claude"}
	container.Config.Cmd = []string{"auth", "status", "--json"}
	container.Config.Env = []string{"CLAUDE_CONFIG_DIR=/home/agent/.claude"}
	programs := programInContainer(standinProgram{"claude", "2.1.323 (Claude Code)", `{"configDirectory":"$CLAUDE_CONFIG_DIR"}`}, nil)

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
