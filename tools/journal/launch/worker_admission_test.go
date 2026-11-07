package launch

import (
	"io"
	"os"
	"os/exec"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestAPendingWorkerStartReservesTheAgentBeforeAnotherRequest(t *testing.T) {
	inputs := NewTerminalInputs()
	entered := make(chan struct{}, 2)
	release := make(chan struct{})
	var releaseOnce sync.Once
	t.Cleanup(func() { releaseOnce.Do(func() { close(release) }) })
	var starts atomic.Int32
	starter := ProcessStarter{Home: t.TempDir(), Inputs: inputs,
		openLog: func(path string) (*TerminalLog, error) {
			entered <- struct{}{}
			<-release
			return OpenTerminalLog(path)
		},
		startTerminal: func(command *exec.Cmd, input io.Reader, screen, log io.Writer) (func() error, error) {
			starts.Add(1)
			return StartInTerminal(command, input, screen, log)
		}}
	socket := shortSocket(t)
	listener, err := Listen(socket, starter, inputs)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	request := WorkerRequest{AgentID: 16, Folder: t.TempDir(), Command: []string{"true"}}
	first := make(chan string, 1)
	go func() { first <- typedRequest(t, socket, request) }()
	select {
	case <-entered:
	case <-time.After(5 * time.Second):
		t.Fatal("the first request never reached terminal startup")
	}
	second := make(chan string, 1)
	go func() { second <- typedRequest(t, socket, request) }()
	select {
	case answer := <-second:
		if answer != RunningAnswer {
			t.Fatalf("the pending start answered %q to another request", answer)
		}
	case <-entered:
		t.Fatal("both requests reached terminal startup")
	case <-time.After(5 * time.Second):
		t.Fatal("the second request waited for the pending startup")
	}
	releaseOnce.Do(func() { close(release) })
	select {
	case answer := <-first:
		if !strings.HasPrefix(answer, StartedAnswer) {
			t.Fatalf("the first request answered %q", answer)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("the first request never answered")
	}
	if starts.Load() != 1 {
		t.Fatalf("terminal startup ran %d times", starts.Load())
	}
}

func TestAWorkerTerminalStartFailureIsAnsweredAndCanRetry(t *testing.T) {
	inputs := NewTerminalInputs()
	starter := ProcessStarter{Home: t.TempDir(), Inputs: inputs}
	socket := shortSocket(t)
	listener, err := Listen(socket, starter, inputs)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	request := WorkerRequest{AgentID: 16, Folder: t.TempDir(), Command: []string{"/no-such-journal-agent"}}
	if answer := typedRequest(t, socket, request); answer != FailedAnswer {
		t.Fatalf("failed terminal startup answered %q", answer)
	}
	if inputs.IsOpen(16) {
		t.Fatal("failed terminal startup kept the agent reserved")
	}
	log, err := os.ReadFile(TerminalFile(starter.Home, 16))
	if err != nil || !strings.Contains(string(log), "/no-such-journal-agent") {
		t.Fatalf("the terminal startup error was not recorded: %q, %v", log, err)
	}
	request.Command = []string{"true"}
	if answer := typedRequest(t, socket, request); !strings.HasPrefix(answer, StartedAnswer) {
		t.Fatalf("the retry answered %q", answer)
	}
}

func TestAnInvalidWorkerStartLeavesTheAgentStartable(t *testing.T) {
	for name, request := range map[string]ProgramStart{
		"empty command":  {AgentID: 16},
		"missing folder": {AgentID: 16, Folder: "/no-such-journal-worktree", Command: []string{"true"}},
	} {
		t.Run(name, func(t *testing.T) {
			inputs := NewTerminalInputs()
			starter := ProcessStarter{Home: t.TempDir(), Inputs: inputs}
			if err := starter.Start(request); err == nil {
				t.Fatal("the invalid startup succeeded")
			}
			if inputs.IsOpen(16) {
				t.Fatal("the invalid startup kept its reservation")
			}
			if err := starter.Start(ProgramStart{AgentID: 16, Folder: t.TempDir(), Command: []string{"true"}}); err != nil {
				t.Fatalf("the valid retry failed: %v", err)
			}
		})
	}
}

func TestAWorkerLogOpenFailureReleasesItsReservation(t *testing.T) {
	inputs := NewTerminalInputs()
	home := t.TempDir() + "/file"
	if err := os.WriteFile(home, []byte("not a folder"), 0600); err != nil {
		t.Fatal(err)
	}
	starter := ProcessStarter{Home: home, Inputs: inputs}
	request := ProgramStart{AgentID: 16, Folder: t.TempDir(), Command: []string{"true"}}
	if err := starter.Start(request); err == nil {
		t.Fatal("startup succeeded without a log folder")
	}
	if inputs.IsOpen(16) {
		t.Fatal("log failure kept the agent reserved")
	}
	starter.Home = t.TempDir()
	if err := starter.Start(request); err != nil {
		t.Fatalf("the retry could not start: %v", err)
	}
}
