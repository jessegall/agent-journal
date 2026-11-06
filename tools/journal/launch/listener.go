package launch

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
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
	Version     bool              `json:"version"`
	Routes      bool              `json:"routes"`
	Running     bool              `json:"running"`
	AnyProgram  bool              `json:"any_program"`
	LocalOnly   bool              `json:"local_only"`
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

// socketDialLimit is how long a launch waits to learn whether another launch still answers on a socket.
const socketDialLimit = 300 * time.Millisecond

// answerWait is how long a closing launch waits for the requests it took: a stop of its own program is answered only
// once that program has ended, which is also what ends the launch.
const answerWait = stopWait + forcedStopWait

// ProcessStarter starts a program in a pseudo terminal of its own in its folder, its output kept in its agent's
// terminal log under the journal's folder and read for its status file.
type ProcessStarter struct {
	Home          string
	Inputs        *TerminalInputs
	OnAnswer      func(agentID int, question, explanation string)
	OnExit        func(agentID, exitCode, pid int)
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
		defer starter.Inputs.Close(start.AgentID)
		err := wait()
		if err != nil {
			_, _ = fmt.Fprintln(log, "agent program ended:", err)
		}
		_ = log.Close()
		if starter.OnExit != nil {
			starter.OnExit(start.AgentID, exitCode(err), command.Process.Pid)
		}
	}()
	return nil
}

// exitCode is the code a program ended with; a program killed by a signal has none of its own, so it counts as failed.
func exitCode(err error) int {
	var exited *exec.ExitError
	if errors.As(err, &exited) {
		return exited.ExitCode()
	}
	if err != nil {
		return 1
	}
	return 0
}

// Listen takes requests on the launcher's socket: it starts each worker's program with its identity, and types a line
// into the terminal of the agent a request names.
func Listen(path string, starter Starter, inputs *TerminalInputs) (io.Closer, error) {
	return ListenVersioned(path, starter, inputs, "")
}

// ListenVersioned replaces the public listener while older launches retain their terminals.
func ListenVersioned(path string, starter Starter, inputs *TerminalInputs, version string) (*Listener, error) {
	previous := setAsidePrevious(path)
	listener, err := net.Listen("unix", path)
	if err != nil {
		restoreFirst(previous, path)
		return nil, err
	}
	listener.(*net.UnixListener).SetUnlinkOnClose(false)
	bound, err := os.Stat(path)
	if err != nil {
		_ = listener.Close()
		_ = os.Remove(path)
		restoreFirst(previous, path)
		return nil, err
	}
	answers := &sync.WaitGroup{}
	answers.Add(1)
	go func() {
		defer answers.Done()
		for {
			connection, err := listener.Accept()
			if err != nil {
				return
			}
			answers.Add(1)
			go func() {
				defer answers.Done()
				answered(connection, starter, inputs, previous, version)
			}()
		}
	}()
	return &Listener{listener: listener, path: path, previous: previous, bound: bound, answers: answers, inputs: inputs}, nil
}

// Listener keeps the public socket and every older terminal owner's socket.
type Listener struct {
	listener net.Listener
	path     string
	previous []string
	bound    os.FileInfo
	answers  *sync.WaitGroup
	inputs   *TerminalInputs
}

// Close frees the name when it is still this launch's, gives it back to the launch before it, and waits for the answers
// still owed.
func (socket *Listener) Close() error {
	err := socket.listener.Close()
	if current, statErr := os.Stat(socket.path); statErr == nil && os.SameFile(current, socket.bound) {
		_ = os.Remove(socket.path)
		restoreFirst(socket.previous, socket.path)
	}
	socket.awaitAnswers()
	return err
}

func (socket *Listener) awaitAnswers() {
	finished := make(chan struct{})
	go func() {
		socket.answers.Wait()
		close(finished)
	}()
	select {
	case <-finished:
	case <-time.After(answerWait):
	}
}

func setAsidePrevious(path string) []string {
	connection, err := net.DialTimeout("unix", path, socketDialLimit)
	if err != nil {
		_ = os.Remove(path)
		return nil
	}
	_ = connection.Close()
	older, _ := socketAnswer(path, WorkerRequest{Routes: true})
	var routes []string
	_ = json.Unmarshal([]byte(older), &routes)
	file, err := os.CreateTemp(filepath.Dir(path), "l-")
	if err != nil {
		return nil
	}
	previous := file.Name()
	_ = file.Close()
	_ = os.Remove(previous)
	if os.Rename(path, previous) != nil {
		return nil
	}
	return append([]string{previous}, routes...)
}

func restorePrevious(previous, path string) bool {
	connection, err := net.DialTimeout("unix", previous, socketDialLimit)
	if err != nil {
		_ = os.Remove(previous)
		return false
	}
	_ = connection.Close()
	return os.Rename(previous, path) == nil
}

func restoreFirst(previous []string, path string) {
	if _, err := os.Lstat(path); !os.IsNotExist(err) {
		return
	}
	for _, previous := range previous {
		if restorePrevious(previous, path) {
			return
		}
	}
}

// forwarded passes a request this launch has no program for to the launch before it, and hands back its answer.
func forwarded(connection net.Conn, request WorkerRequest, previous []string) {
	if request.LocalOnly {
		return
	}
	if answer := previousAnswer(request, previous); answer != "" {
		_, _ = io.WriteString(connection, answer+"\n")
	}
}

func answered(connection net.Conn, starter Starter, inputs *TerminalInputs, previous []string, version string) {
	defer connection.Close()
	var request WorkerRequest
	if err := json.NewDecoder(connection).Decode(&request); err != nil {
		return
	}
	if request.Version {
		_, _ = io.WriteString(connection, version+"\n")
		return
	}
	if request.Routes {
		_ = json.NewEncoder(connection).Encode(previous)
		return
	}
	if request.Running || request.AnyProgram {
		if inputs.IsOpen(request.AgentID) || request.AnyProgram && inputs.HasPrograms() {
			_, _ = io.WriteString(connection, RunningAnswer+"\n")
			return
		}
		forwarded(connection, request, previous)
		return
	}
	if request.Stop {
		if inputs.StopProgram(request.AgentID) {
			_, _ = io.WriteString(connection, StoppedAnswer+"\n")
			return
		}
		forwarded(connection, request, previous)
		return
	}
	if request.InputLine != "" {
		if inputs.TypeLine(request.AgentID, request.InputLine) {
			_, _ = io.WriteString(connection, TypedAnswer+"\n")
			return
		}
		forwarded(connection, request, previous)
		return
	}
	if len(request.Command) == 0 {
		return
	}
	if inputs.IsOpen(request.AgentID) || previousAnswer(WorkerRequest{AgentID: request.AgentID, Running: true}, previous) != "" {
		_, _ = io.WriteString(connection, RunningAnswer+"\n")
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
	} else if pid := inputs.ProgramPid(request.AgentID); pid > 0 {
		answer = StartedAnswer + " " + strconv.Itoa(pid)
	}
	_, _ = io.WriteString(connection, answer+"\n")
}
