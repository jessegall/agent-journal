package launch

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

// TypedAnswer is what the launcher answers once it has typed a line into an agent's terminal, and StartedAnswer and
// FailedAnswer whether it could start a worker's program; RunningAnswer says one of that worker's runs already, so
// its waiting line reaches it by its next hook.
const (
	TypedAnswer   = "typed"
	StartedAnswer = "started"
	FailedAnswer  = "failed"
	RunningAnswer = "running"
	StoppedAnswer = "stopped"
)

// ErrProgramRunning is the refusal of a second program for an agent whose program still runs.
var ErrProgramRunning = errors.New("a program of this agent runs already")

// WorkerRequest is what a dispatch hands the launcher: the worker's agent row and session, its environment, the
// worktree it starts in and the command line that starts its program. A request naming a typed line instead types it
// into that agent's terminal, and one that says stop ends that agent's program.
type WorkerRequest struct {
	AgentID     int               `json:"agent_id"`
	Session     string            `json:"session"`
	Environment string            `json:"environment"`
	Folder      string            `json:"folder"`
	Command     []string          `json:"command"`
	Variables   map[string]string `json:"variables"`
	InputLine   string            `json:"typed"`
	Stop        bool              `json:"stop"`
}

// ProgramStart is one program the launcher starts: its agent row, its folder, its command line and the variables it
// starts with.
type ProgramStart struct {
	AgentID   int
	Folder    string
	Command   []string
	Variables map[string]string
}

// Starter starts a program for the launcher.
type Starter interface {
	Start(start ProgramStart) error
}

// ProcessStarter starts a program in a pseudo terminal of its own in its folder, its output kept in its agent's
// terminal log under the journal's folder and read for its status file.
type ProcessStarter struct {
	Home          string
	Inputs        *TerminalInputs
	OnAnswer      func(agentID int, question, explanation string)
	openLog       func(string) (*TerminalLog, error)
	startTerminal func(*exec.Cmd, io.Reader, io.Writer, io.Writer) (func() error, error)
}

// Start starts the program and leaves it running.
func (starter ProcessStarter) Start(start ProgramStart) error {
	if len(start.Command) == 0 {
		return errors.New("no agent program was given")
	}
	if !starter.Inputs.Reserve(start.AgentID) {
		return ErrProgramRunning
	}
	command := exec.Command(start.Command[0], start.Command[1:]...)
	command.Dir = start.Folder
	command.Env = os.Environ()
	for name, value := range start.Variables {
		command.Env = append(command.Env, name+"="+value)
	}
	openLog := starter.openLog
	if openLog == nil {
		openLog = OpenTerminalLog
	}
	log, err := openLog(TerminalFile(starter.Home, start.AgentID))
	if err != nil {
		starter.Inputs.Close(start.AgentID)
		return err
	}
	watcher := NewMenuWatcher(starter.Inputs, start.AgentID, func(question, explanation string) {
		if starter.OnAnswer != nil {
			starter.OnAnswer(start.AgentID, question, explanation)
		}
	})
	startTerminal := starter.startTerminal
	if startTerminal == nil {
		startTerminal = StartInTerminal
	}
	wait, err := startTerminal(command, starter.Inputs.Open(start.AgentID, strings.NewReader("")), io.Discard, io.MultiWriter(log, watcher, NewProgramStatus(starter.Home)))
	if err != nil {
		_, _ = fmt.Fprintln(log, "could not start agent program:", err)
		_ = log.Close()
		starter.Inputs.Close(start.AgentID)
		return err
	}
	starter.Inputs.Track(start.AgentID, command)
	stop := make(chan struct{})
	go watcher.Watch(stop)
	go func() {
		defer close(stop)
		defer log.Close()
		defer starter.Inputs.Close(start.AgentID)
		if err := wait(); err != nil {
			_, _ = fmt.Fprintln(log, "agent program ended:", err)
		}
	}()
	return nil
}

// Listen takes requests on the launcher's socket: it starts each worker's program with its identity, and types a line
// into the terminal of the agent a request names.
func Listen(path string, starter Starter, inputs *TerminalInputs) (io.Closer, error) {
	_ = os.Remove(path)
	listener, err := net.Listen("unix", path)
	if err != nil {
		return nil, err
	}
	go func() {
		for {
			connection, err := listener.Accept()
			if err != nil {
				return
			}
			go answered(connection, starter, inputs)
		}
	}()
	return listener, nil
}

func answered(connection net.Conn, starter Starter, inputs *TerminalInputs) {
	defer connection.Close()
	var request WorkerRequest
	if err := json.NewDecoder(connection).Decode(&request); err != nil {
		return
	}
	if request.Stop {
		if inputs.StopProgram(request.AgentID) {
			_, _ = io.WriteString(connection, StoppedAnswer+"\n")
		}
		return
	}
	if request.InputLine != "" {
		if inputs.TypeLine(request.AgentID, request.InputLine) {
			_, _ = io.WriteString(connection, TypedAnswer+"\n")
		}
		return
	}
	if len(request.Command) == 0 {
		return
	}
	variables := map[string]string{"JOURNAL_AGENT_ID": strconv.Itoa(request.AgentID), "JOURNAL_SESSION": request.Session, EnvironmentVariable: request.Environment, ActiveVariable: "1"}
	for name, value := range request.Variables {
		variables[name] = value
	}
	answer := StartedAnswer
	if err := starter.Start(ProgramStart{AgentID: request.AgentID, Folder: request.Folder, Command: request.Command, Variables: variables}); errors.Is(err, ErrProgramRunning) {
		answer = RunningAnswer
	} else if err != nil {
		answer = FailedAnswer
	}
	_, _ = io.WriteString(connection, answer+"\n")
}
