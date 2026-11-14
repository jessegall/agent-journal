package launch

import (
	"encoding/json"
	"errors"
	"io"
	"net"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
	"os/exec"
	"strconv"
)

// fakeStarter keeps the programs the launcher was asked to start.
type fakeStarter struct {
	started chan ProgramStart
}

func (starter fakeStarter) Start(start ProgramStart) error {
	starter.started <- start
	return nil
}

func TestAWorkerRequestOnTheLaunchersSocketStartsItsProgramInTheWorktreeWithTheWorkersIdentity(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	socket := filepath.Join(folder, "launcher.sock")
	starter := fakeStarter{started: make(chan ProgramStart, 1)}
	listener, err := Listen(socket, starter, NewTerminalInputs())
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	connection, err := net.Dial("unix", socket)
	if err != nil {
		t.Fatal(err)
	}
	request := WorkerRequest{AgentID: 16, Session: "u-1", Environment: "main", Folder: "/work/shop/.journal/worktrees/main/worker-16", Command: []string{"claude", "--session-id", "u-1"}}
	if err := json.NewEncoder(connection).Encode(request); err != nil {
		t.Fatal(err)
	}
	connection.Close()
	select {
	case start := <-starter.started:
		if start.Folder != request.Folder || start.Command[0] != "claude" || start.Variables["JOURNAL_AGENT_ID"] != "16" || start.Variables["JOURNAL_ENV"] != "main" {
			t.Fatalf("the worker started as %+v", start)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("no program was started for the worker")
	}
}

// refusingStarter cannot start anything.
type refusingStarter struct{}

func (refusingStarter) Start(start ProgramStart) error {
	return errors.New("no such folder")
}

func TestASecondProgramOfARunningWorkerIsRefused(t *testing.T) {
	inputs := NewTerminalInputs()
	inputs.Open(16, strings.NewReader(""))
	starter := ProcessStarter{Home: t.TempDir(), Inputs: inputs}
	if err := starter.Start(ProgramStart{AgentID: 16, Folder: t.TempDir(), Command: []string{"true"}}); !errors.Is(err, ErrProgramRunning) {
		t.Fatalf("the second start answered %v", err)
	}
}

type trackingStarter struct {
	inputs  *TerminalInputs
	program *exec.Cmd
}

func (starter trackingStarter) Start(start ProgramStart) error {
	starter.inputs.Track(start.AgentID, starter.program)
	return nil
}

func TestTheLauncherAnswersThePidOfTheProgramItStarted(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	program := exec.Command("sleep", "60")
	if err := program.Start(); err != nil {
		t.Fatal(err)
	}
	defer func() {
		_ = program.Process.Kill()
		_ = program.Wait()
	}()
	inputs := NewTerminalInputs()
	socket := filepath.Join(folder, "pid.sock")
	listener, err := Listen(socket, trackingStarter{inputs, program}, inputs)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	connection, err := net.Dial("unix", socket)
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Close()
	if err := json.NewEncoder(connection).Encode(WorkerRequest{AgentID: 17, Folder: folder, Command: []string{"claude"}}); err != nil {
		t.Fatal(err)
	}
	_ = connection.SetReadDeadline(time.Now().Add(5 * time.Second))
	answer, err := io.ReadAll(connection)
	want := StartedAnswer + " " + strconv.Itoa(program.Process.Pid)
	if err != nil || strings.TrimSpace(string(answer)) != want {
		t.Fatalf("the launcher answered %q, %v, not %q", answer, err, want)
	}
}

func TestTheLauncherAnswersWhetherItStartedTheProgram(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	for want, starter := range map[string]Starter{StartedAnswer: fakeStarter{started: make(chan ProgramStart, 1)}, FailedAnswer: refusingStarter{}} {
		socket := filepath.Join(folder, want+".sock")
		listener, err := Listen(socket, starter, NewTerminalInputs())
		if err != nil {
			t.Fatal(err)
		}
		defer listener.Close()
		connection, err := net.Dial("unix", socket)
		if err != nil {
			t.Fatal(err)
		}
		defer connection.Close()
		if err := json.NewEncoder(connection).Encode(WorkerRequest{AgentID: 16, Folder: folder, Command: []string{"claude"}}); err != nil {
			t.Fatal(err)
		}
		_ = connection.SetReadDeadline(time.Now().Add(5 * time.Second))
		answer, err := io.ReadAll(connection)
		if err != nil || strings.TrimSpace(string(answer)) != want {
			t.Fatalf("the launcher answered %q, %v, not %q", answer, err, want)
		}
	}
}

