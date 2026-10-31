package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// StartLimit is how long a client waits for a server it started, or one another client is starting.
var StartLimit = 5 * time.Second

// MaintenanceMark is the file a change of the journal's code keeps in the home while it stops the server and holds the
// lock: a client starts no server while it is there, and it counts for MaintenanceLimit at most, so a change that died
// leaves nobody locked out.
const MaintenanceMark = "maintenance"

const MaintenanceLimit = 10 * time.Minute

// PollInterval is how often a waiting client checks for an answer and for the lock.
var PollInterval = 50 * time.Millisecond

// Healthy says whether a server answers GET /health.
func Healthy(client *http.Client) bool {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, "http://journal/health", nil)
	if err != nil {
		return false
	}
	response, err := client.Do(request)
	if err != nil {
		return false
	}
	response.Body.Close()
	return response.StatusCode == http.StatusOK
}

// ServerStarter starts a server for a journal's folder, detached from the client.
type ServerStarter func(home string) (*os.Process, error)

// ErrNoServer is returned when no server answered within StartLimit.
var ErrNoServer = errors.New("no server answered in time")

// Connect returns a client to a healthy server, starting one when nothing answers and the lock is free; while
// it waits it checks the lock again on every round, so a server that let the lock go is replaced at once. The
// process it started is returned, so a caller can stop it when it never answered.
func Connect(home string, start ServerStarter) (*http.Client, *os.Process, error) {
	client := socket.Client(socket.Path(home))
	deadline := time.Now().Add(StartLimit)
	var started *os.Process
	for {
		if Healthy(client) {
			return client, started, nil
		}
		if started == nil && !InMaintenance(home) && LockIsFree(filepath.Join(home, "server.lock")) {
			process, err := start(home)
			if err != nil {
				return nil, nil, err
			}
			started = process
		}
		if time.Now().After(deadline) {
			return nil, started, ErrNoServer
		}
		time.Sleep(PollInterval)
	}
}

// StartServer runs the server detached: its own session, a clean environment, the project folder as its working
// folder, and its output appended to runtime/server.log.
func StartServer(home string) (*os.Process, error) {
	if err := os.MkdirAll(filepath.Join(home, "runtime"), 0o700); err != nil {
		return nil, err
	}
	log, err := os.OpenFile(filepath.Join(home, "runtime", "server.log"), os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o600)
	if err != nil {
		return nil, err
	}
	defer log.Close()
	source := SourceFolder(home)
	command := exec.Command(PythonPath(), filepath.Join(source, "server", "server.py"), "--home", home)
	command.Dir = filepath.Dir(home)
	command.Env = []string{"PATH=" + os.Getenv("PATH"), "HOME=" + os.Getenv("HOME"), "LANG=" + os.Getenv("LANG"), "PYTHONPATH=" + source}
	command.Stdin, command.Stdout, command.Stderr = nil, log, log
	command.SysProcAttr = DetachedProcess()
	if err := command.Start(); err != nil {
		return nil, err
	}
	return command.Process, nil
}

// SourceFolder is the folder holding core and server: JOURNAL_SOURCE when set, else src beside the journal's
// folder.
func SourceFolder(home string) string {
	if source := os.Getenv("JOURNAL_SOURCE"); source != "" {
		return source
	}
	return filepath.Join(filepath.Dir(home), "src")
}

// PythonPath is the Python the server and a direct run use: JOURNAL_PYTHON when set, else python3.
func PythonPath() string {
	if python := os.Getenv("JOURNAL_PYTHON"); python != "" {
		return python
	}
	return "python3"
}

// InMaintenance is whether a change of the journal's code has the server stopped: its mark names the process making
// the change, and counts while that process runs and the mark is not older than MaintenanceLimit.
func InMaintenance(home string) bool {
	path := filepath.Join(home, MaintenanceMark)
	info, err := os.Stat(path)
	if err != nil || time.Since(info.ModTime()) >= MaintenanceLimit {
		return false
	}
	text, err := os.ReadFile(path)
	pid, parsed := strconv.Atoi(strings.TrimSpace(string(text)))
	return err != nil || parsed != nil || ProcessAlive(pid)
}
