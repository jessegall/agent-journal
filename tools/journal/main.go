package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// Exit codes, as the journal's console gives them.
const (
	SuccessCode = 0
	UsageCode   = 2
	ErrorCode   = 3
)

// ExitCodeTrailer is the trailer a /cli answer ends with.
const ExitCodeTrailer = "Journal-Exit-Code"

// CliLimit is how long the server may stay silent on a command line before the client stops waiting. A line it
// writes while it waits starts the limit again, so a long wait on a plugin's script goes on.
var CliLimit = 10 * time.Minute

// DrainLimit is how long a stopping server may take to finish its open requests, as the server's own limit.
var DrainLimit = 10 * time.Second

// FailedStartPeriod is how long a failed start makes later clients run directly instead of starting a server.
var FailedStartPeriod = 60 * time.Second

// GoPrograms are the journal's programs a source tree may hold under tools.
var GoPrograms = []string{"journal", "journal-hook", "journal-run"}

func main() {
	requestTiming := timing.Started()
	os.Exit(Run(requestTiming, os.Args[1:], os.Stdout, os.Stderr))
}

// Run sends one command line to the journal's server and prints its answer as it comes; when no server can be
// started it runs the line directly, so a server fault makes the journal slower, never broken. The request
// carries the timing main started, stamped go_sent before the post and go_resent before the one resend.
func Run(requestTiming *timing.Timing, argv []string, stdout, stderr io.Writer) int {
	home := JournalHome()
	if len(argv) == 1 && argv[0] == "launcher-service" {
		return RunLauncherService(home, stderr)
	}
	if len(argv) == 1 && argv[0] == "launcher-replace" {
		return ReplaceLauncher(home, stderr)
	}
	if len(argv) > 0 && argv[0] == "launch" {
		return LaunchProgram(home, argv[1:], stdout, stderr)
	}
	if len(argv) > 0 && argv[0] == "worktree" && !(len(argv) > 1 && argv[1] == "prepare") {
		return WorktreeCommand(argv[1:], stdout, stderr)
	}
	if len(argv) == 3 && argv[0] == "output" && argv[1] == "monitor" {
		return OutputMonitor(argv[2], stdout, stderr)
	}
	if len(argv) == 2 && argv[0] == "server" && argv[1] == "stop" {
		return StopServer(home, stdout, stderr)
	}
	if len(argv) == 2 && argv[0] == "server" && argv[1] == "update" {
		return ServerUpdate(home, stdout, stderr)
	}
	if !ServerSupported || FailedRecently(home) {
		return DirectRun(home, argv, stdout, stderr)
	}
	client, started, err := Connect(home, StartServer)
	if err != nil {
		if started != nil {
			started.Kill()
		}
		MarkFailed(home)
		fmt.Fprintf(stderr, "the journal's server did not start; this line runs directly. %s\n", LastLogLines(home, 3))
		return DirectRun(home, argv, stdout, stderr)
	}
	argv, inputErr := BodyFromInput(argv, os.Stdin)
	if inputErr != nil {
		fmt.Fprintln(stderr, "standard input could not be read:", inputErr)
		return 1
	}
	request := NewCliRequest(argv, os.LookupEnv, WorkingFolder())
	if len(argv) == 1 && argv[0] == "viewer" {
		return ViewerLink(client, request, stdout, stderr)
	}
	code, status := SendCli(client, request, requestTiming, "go_sent", stdout, stderr)
	if status != http.StatusConflict {
		return code
	}
	client, _, err = Connect(home, StartServer)
	if err != nil {
		fmt.Fprintln(stderr, "the journal's server restarted for newer code and did not come back")
		return ErrorCode
	}
	code, status = SendCli(client, request, requestTiming, "go_resent", stdout, stderr)
	if status == http.StatusConflict {
		fmt.Fprintln(stderr, "the journal's server answered newer code twice")
		return ErrorCode
	}
	return code
}

// StopServer asks a running server to stop and waits until it has let its lock go.
func StopServer(home string, stdout, stderr io.Writer) int {
	client := socket.Client(socket.Path(home))
	if !Healthy(client) {
		fmt.Fprintln(stdout, "no server is running")
		return SuccessCode
	}
	response, err := client.Post("http://journal/stop", "application/json", nil)
	if err != nil {
		fmt.Fprintf(stderr, "the server did not take the stop: %v\n", err)
		return ErrorCode
	}
	response.Body.Close()
	deadline := time.Now().Add(DrainLimit)
	for !LockIsFree(filepath.Join(home, "server.lock")) {
		if time.Now().After(deadline) {
			fmt.Fprintln(stderr, "the server is still finishing its requests")
			return ErrorCode
		}
		time.Sleep(PollInterval)
	}
	fmt.Fprintln(stdout, "the server stopped")
	return SuccessCode
}

// SendCli posts the request, copies the answer's output to stdout as it streams in, and returns the exit code
// the answer ends with and the HTTP status. The timing is stamped with the given name right before the post and
// sent in its header. A timeout is never resent: the command may still be running.
// idleTimeoutWriter resets the timer when it writes data.
type idleTimeoutWriter struct {
	destination io.Writer
	timer       *time.Timer
}

func (writer idleTimeoutWriter) Write(data []byte) (int, error) {
	writer.timer.Reset(CliLimit)
	return writer.destination.Write(data)
}

func SendCli(client *http.Client, request CliRequest, requestTiming *timing.Timing, stampName string, stdout, stderr io.Writer) (int, int) {
	body, err := request.Body()
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode, 0
	}
	limit, cancel := context.WithCancel(context.Background())
	defer cancel()
	silence := time.AfterFunc(CliLimit, cancel)
	defer silence.Stop()
	post, err := http.NewRequestWithContext(limit, http.MethodPost, "http://journal/cli", bytes.NewReader(body))
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode, 0
	}
	requestTiming.Stamp(stampName)
	post.Header.Set(timing.Header, requestTiming.Text())
	response, err := client.Do(post)
	if err != nil {
		fmt.Fprintf(stderr, "the journal's server did not answer: %v; the command may still be running\n", err)
		return ErrorCode, 0
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		fmt.Fprintln(stderr, ErrorLine(response.Body))
		if response.StatusCode == http.StatusBadRequest {
			return UsageCode, response.StatusCode
		}
		return ErrorCode, response.StatusCode
	}
	if _, err := io.Copy(idleTimeoutWriter{stdout, silence}, response.Body); err != nil {
		fmt.Fprintf(stderr, "the answer broke off: %v; the command may still be running\n", err)
		return ErrorCode, response.StatusCode
	}
	code, err := strconv.Atoi(response.Trailer.Get(ExitCodeTrailer))
	if err != nil {
		return ErrorCode, response.StatusCode
	}
	return code, response.StatusCode
}

// ErrorLine is the error a JSON answer names, or its text.
func ErrorLine(body io.Reader) string {
	text, _ := io.ReadAll(body)
	var answer struct {
		Error string `json:"error"`
	}
	if json.Unmarshal(text, &answer) == nil && answer.Error != "" {
		return answer.Error
	}
	return strings.TrimSpace(string(text))
}

// ServerUpdate puts the project's own source tree in use: it builds the Go programs a source tree holds, then a new
// server takes over from the running one. It runs in the client, on the code it installs, so neither a stopped server
// nor a block can hold it.
func ServerUpdate(home string, stdout, stderr io.Writer) int {
	project := filepath.Dir(home)
	source := filepath.Join(project, "src")
	for _, program := range GoPrograms {
		folder := filepath.Join(project, "tools", program)
		if _, err := os.Stat(folder); err != nil {
			continue
		}
		built := filepath.Join(home, "bin", program)
		command := exec.Command("go", "-C", folder, "build", "-trimpath", "-o", built+".new", ".")
		if code := CommandCode(command, stdout, stderr); code != SuccessCode {
			return code
		}
		if err := os.Rename(built+".new", built); err != nil {
			fmt.Fprintln(stderr, err)
			return ErrorCode
		}
	}
	command := exec.Command(PythonPath(), filepath.Join(source, "install", "working_tree_install.py"), project, source)
	command.Env = append(os.Environ(), "PYTHONPATH="+source)
	return CommandCode(command, stdout, stderr)
}

// DirectRun runs the command line in a Python process of its own, as the journal ran before the server.
func DirectRun(home string, argv []string, stdout, stderr io.Writer) int {
	source := SourceFolder(home)
	command := exec.Command(PythonPath(), append([]string{filepath.Join(source, "core", "journal.py")}, argv...)...)
	command.Env = append(os.Environ(), "JOURNAL_HOME="+home)
	return CommandCode(command, stdout, stderr)
}

// CommandCode runs a command with this program's input and the given output, and gives its exit code.
func CommandCode(command *exec.Cmd, stdout, stderr io.Writer) int {
	command.Stdin, command.Stdout, command.Stderr = os.Stdin, stdout, stderr
	if err := command.Run(); err != nil {
		var exit *exec.ExitError
		if errors.As(err, &exit) {
			return exit.ExitCode()
		}
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	return SuccessCode
}

// HomeOfBinary is the .journal folder a binary at this path sits in, empty when it sits elsewhere.
func HomeOfBinary(path string) string {
	bin := filepath.Dir(path)
	home := filepath.Dir(bin)
	if filepath.Base(bin) == "bin" && filepath.Base(home) == ".journal" {
		return home
	}
	return ""
}

// RunningBinaryHome is the .journal folder this binary sits in, so a run from a worktree or a subfolder reaches the project's journal.
func RunningBinaryHome() string {
	path, err := os.Executable()
	if err != nil {
		return ""
	}
	resolved, err := filepath.EvalSymlinks(path)
	if err != nil {
		return ""
	}
	return HomeOfBinary(resolved)
}

// JournalHome is the journal's folder: JOURNAL_HOME when set, else the .journal the binary sits in, else .journal in the working folder, made absolute.
func JournalHome() string {
	home := os.Getenv("JOURNAL_HOME")
	if home == "" {
		home = RunningBinaryHome()
	}
	if home == "" {
		home = ".journal"
	}
	absolute, err := filepath.Abs(home)
	if err != nil {
		return home
	}
	return absolute
}

// FailedRecently says whether a server failed to start within FailedStartPeriod.
func FailedRecently(home string) bool {
	status, err := os.Stat(filepath.Join(home, "server.failed"))
	return err == nil && time.Since(status.ModTime()) < FailedStartPeriod
}

// MarkFailed notes a failed start, so other clients run directly for FailedStartPeriod instead of waiting.
func MarkFailed(home string) {
	os.WriteFile(filepath.Join(home, "server.failed"), []byte(time.Now().UTC().Format(time.RFC3339)+"\n"), 0o600)
}

// LastLogLines is the end of the server's log, to say why it did not start.
func LastLogLines(home string, count int) string {
	file, err := os.Open(filepath.Join(home, "runtime", "server.log"))
	if err != nil {
		return ""
	}
	defer file.Close()
	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	if len(lines) > count {
		lines = lines[len(lines)-count:]
	}
	return strings.Join(lines, " | ")
}
