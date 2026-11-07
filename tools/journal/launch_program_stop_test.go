//go:build darwin || linux

package main

import (
	"bufio"
	"encoding/json"
	"errors"
	"io"
	"net"
	"os"
	"os/exec"
	"strings"
	"syscall"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal/launch"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// stopAnswer asks the launcher on the socket to stop the agent's program and gives what it answered.
func stopAnswer(t *testing.T, path string, agentID int) string {
	t.Helper()
	connection, err := net.Dial("unix", path)
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Close()
	if err := json.NewEncoder(connection).Encode(launch.WorkerRequest{AgentID: agentID, Stop: true}); err != nil {
		t.Fatal(err)
	}
	answer, _ := bufio.NewReader(connection).ReadString('\n')
	return strings.TrimSpace(answer)
}

func TestAStopOnTheSocketEndsTheLaunchOwnProgramAndIsAnsweredBeforeTheLaunchCloses(t *testing.T) {
	home, err := os.MkdirTemp("", "lp")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(home) })
	inputs := launch.NewTerminalInputs()
	path := socket.NamedPath(home, "launcher")
	listener, err := launch.Listen(path, launch.ProcessStarter{Home: home, Inputs: inputs}, inputs)
	if err != nil {
		t.Fatal(err)
	}
	command := exec.Command("sh", "-c", "sleep 60")
	ended := make(chan error, 1)
	go func() {
		err := runMainProgram(inputs, 7, command, strings.NewReader(""), func(input io.Reader, started func()) error {
			return launch.RunInTerminal(command, input, io.Discard, io.Discard, started)
		})
		_ = listener.Close()
		ended <- err
	}()
	answer, deadline := "", time.Now().Add(5*time.Second)
	for answer != launch.StoppedAnswer && time.Now().Before(deadline) {
		answer = stopAnswer(t, path, 7)
	}
	if answer != launch.StoppedAnswer {
		t.Fatalf("the launcher answered %q to a stop of its own program", answer)
	}
	select {
	case err := <-ended:
		var exit *exec.ExitError
		if !errors.As(err, &exit) {
			t.Fatalf("the program ended by itself: %v", err)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("the launch did not end with its program")
	}
	if inputs.IsOpen(7) {
		t.Fatal("the ended program stayed in the inputs")
	}
	if syscall.Kill(command.Process.Pid, 0) == nil {
		t.Fatal("the program's process still runs")
	}
}

func TestAProgramThatDoesNotStartIsNotKept(t *testing.T) {
	inputs := launch.NewTerminalInputs()
	command := exec.Command("/no-such-journal-agent")
	err := runMainProgram(inputs, 7, command, strings.NewReader(""), func(input io.Reader, started func()) error {
		return launch.RunInTerminal(command, input, io.Discard, io.Discard, started)
	})
	if err == nil || inputs.IsOpen(7) || inputs.StopProgram(7) {
		t.Fatalf("a program that never started was kept: %v", err)
	}
}
