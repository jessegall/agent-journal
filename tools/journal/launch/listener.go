package launch

import (
	"encoding/json"
	"io"
	"net"
	"os"
	"os/exec"
	"strconv"
)

// WorkerRequest is what a dispatch hands the launcher: the worker's agent row and session, its environment, the
// worktree it starts in and the command line that starts its program.
type WorkerRequest struct {
	AgentID     int      `json:"agent_id"`
	Session     string   `json:"session"`
	Environment string   `json:"environment"`
	Folder      string   `json:"folder"`
	Command     []string `json:"command"`
}

// ProgramStart is one program the launcher starts: its folder, its command line and the variables it starts with.
type ProgramStart struct {
	Folder    string
	Command   []string
	Variables map[string]string
}

// Starter starts a program for the launcher.
type Starter interface {
	Start(start ProgramStart) error
}

// ProcessStarter starts a program as a process of its own in its folder.
type ProcessStarter struct{}

// Start starts the program and leaves it running.
func (ProcessStarter) Start(start ProgramStart) error {
	command := exec.Command(start.Command[0], start.Command[1:]...)
	command.Dir = start.Folder
	command.Env = os.Environ()
	for name, value := range start.Variables {
		command.Env = append(command.Env, name+"="+value)
	}
	return command.Start()
}

// Listen takes worker requests on the launcher's socket and starts each worker's program with its identity.
func Listen(path string, starter Starter) (io.Closer, error) {
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
			go started(connection, starter)
		}
	}()
	return listener, nil
}

func started(connection net.Conn, starter Starter) {
	defer connection.Close()
	var request WorkerRequest
	if err := json.NewDecoder(connection).Decode(&request); err != nil || len(request.Command) == 0 {
		return
	}
	variables := map[string]string{"JOURNAL_AGENT_ID": strconv.Itoa(request.AgentID), "JOURNAL_SESSION": request.Session, EnvironmentVariable: request.Environment, ActiveVariable: "1"}
	_ = starter.Start(ProgramStart{Folder: request.Folder, Command: request.Command, Variables: variables})
}
