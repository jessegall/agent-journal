package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"
)

// SocketPathLimit is the longest socket path the server binds in the journal's folder; past it both sides use a
// short path under /tmp named by a hash of the long one, as the server's socket_path does.
const SocketPathLimit = 100

// StartLimit is how long a client waits for a server it started, or one another client is starting.
var StartLimit = 5 * time.Second

// PollInterval is how often a waiting client checks for an answer and for the lock.
var PollInterval = 50 * time.Millisecond

// SocketPath is the server's socket for a journal's folder.
func SocketPath(home string) string {
	resolved, err := filepath.EvalSymlinks(home)
	if err != nil {
		resolved = home
	}
	absolute, err := filepath.Abs(resolved)
	if err != nil {
		absolute = resolved
	}
	path := filepath.Join(absolute, "server.sock")
	if len(path) <= SocketPathLimit {
		return path
	}
	sum := sha256.Sum256([]byte(path))
	return filepath.Join("/tmp", "journal-"+hex.EncodeToString(sum[:])[:16]+".sock")
}

// SocketClient speaks HTTP over the server's Unix socket.
func SocketClient(socket string) *http.Client {
	dial := func(ctx context.Context, _, _ string) (net.Conn, error) {
		var dialer net.Dialer
		return dialer.DialContext(ctx, "unix", socket)
	}
	return &http.Client{Transport: &http.Transport{DialContext: dial}}
}

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

// LockIsFree takes the server lock without waiting and lets it go at once: a free lock means no server is
// running, starting or stopping. The client never holds it while a server starts, so the server can take it.
func LockIsFree(path string) bool {
	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0o600)
	if err != nil {
		return false
	}
	defer file.Close()
	if syscall.Flock(int(file.Fd()), syscall.LOCK_EX|syscall.LOCK_NB) != nil {
		return false
	}
	return syscall.Flock(int(file.Fd()), syscall.LOCK_UN) == nil
}

// ServerStarter starts a server for a journal's folder, detached from the client.
type ServerStarter func(home string) (*os.Process, error)

// ErrNoServer is returned when no server answered within StartLimit.
var ErrNoServer = errors.New("no server answered in time")

// Connect returns a client to a healthy server, starting one when nothing answers and the lock is free; while
// it waits it checks the lock again on every round, so a server that let the lock go is replaced at once. The
// process it started is returned, so a caller can stop it when it never answered.
func Connect(home string, start ServerStarter) (*http.Client, *os.Process, error) {
	client := SocketClient(SocketPath(home))
	deadline := time.Now().Add(StartLimit)
	var started *os.Process
	for {
		if Healthy(client) {
			return client, started, nil
		}
		if started == nil && LockIsFree(filepath.Join(home, "server.lock")) {
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
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
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
