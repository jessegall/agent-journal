package launch

import (
	"encoding/json"
	"io"
	"net"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

// TypedAnswer is what the launcher answers once it has typed a line into an agent's terminal.
const TypedAnswer = "typed"

// WorkerRequest is what a dispatch hands the launcher: the worker's agent row and session, its environment, the
// worktree it starts in and the command line that starts its program. A request naming a typed line instead types it
// into that agent's terminal.
type WorkerRequest struct {
	AgentID     int               `json:"agent_id"`
	Session     string            `json:"session"`
	Environment string            `json:"environment"`
	Folder      string            `json:"folder"`
	Command     []string          `json:"command"`
	Variables   map[string]string `json:"variables"`
	Typed       string            `json:"typed"`
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
// terminal log under the journal's folder.
type ProcessStarter struct {
	Home   string
	Inputs *TerminalInputs
}

// Start starts the program and leaves it running.
func (starter ProcessStarter) Start(start ProgramStart) error {
	command := exec.Command(start.Command[0], start.Command[1:]...)
	command.Dir = start.Folder
	command.Env = os.Environ()
	for name, value := range start.Variables {
		command.Env = append(command.Env, name+"="+value)
	}
	log, err := OpenTerminalLog(TerminalFile(starter.Home, start.AgentID))
	if err != nil {
		return err
	}
	go func() {
		defer log.Close()
		defer starter.Inputs.Close(start.AgentID)
		_ = RunInTerminal(command, starter.Inputs.Open(start.AgentID, strings.NewReader("")), io.Discard, log)
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
	if request.Typed != "" {
		if inputs.TypeLine(request.AgentID, request.Typed) {
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
	_ = starter.Start(ProgramStart{AgentID: request.AgentID, Folder: request.Folder, Command: request.Command, Variables: variables})
}
