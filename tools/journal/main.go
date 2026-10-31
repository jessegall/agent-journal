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
)

// Exit codes, as the journal's console gives them.
const (
	SuccessCode = 0
	UsageCode   = 2
	ErrorCode   = 3
)

// ExitCodeTrailer is the trailer a /cli answer ends with.
const ExitCodeTrailer = "Journal-Exit-Code"

// CliLimit is how long a command line may run through the server before the client stops waiting.
var CliLimit = 10 * time.Minute

// DrainLimit is how long a stopping server may take to finish its open requests, as the server's own limit.
var DrainLimit = 10 * time.Second

// FailedStartPeriod is how long a failed start makes later clients run directly instead of starting a server.
var FailedStartPeriod = 60 * time.Second

func main() {
	os.Exit(Run(os.Args[1:], os.Stdout, os.Stderr))
}

// Run sends one command line to the journal's server and prints its answer as it comes; when no server can be
// started it runs the line directly, so a server fault makes the journal slower, never broken.
func Run(argv []string, stdout, stderr io.Writer) int {
	home := JournalHome()
	if len(argv) == 2 && argv[0] == "server" && argv[1] == "stop" {
		return StopServer(home, stdout, stderr)
	}
	if FailedRecently(home) {
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
	request := NewCliRequest(argv, os.LookupEnv, WorkingFolder())
	code, status := SendCli(client, request, stdout, stderr)
	if status != http.StatusConflict {
		return code
	}
	client, _, err = Connect(home, StartServer)
	if err != nil {
		fmt.Fprintln(stderr, "the journal's server restarted for newer code and did not come back")
		return ErrorCode
	}
	code, status = SendCli(client, request, stdout, stderr)
	if status == http.StatusConflict {
		fmt.Fprintln(stderr, "the journal's server answered newer code twice")
		return ErrorCode
	}
	return code
}

// StopServer asks a running server to stop and waits until it has let its lock go.
func StopServer(home string, stdout, stderr io.Writer) int {
	client := SocketClient(SocketPath(home))
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
// the answer ends with and the HTTP status. A timeout is never resent: the command may still be running.
func SendCli(client *http.Client, request CliRequest, stdout, stderr io.Writer) (int, int) {
	body, err := request.Body()
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode, 0
	}
	ctx, cancel := context.WithTimeout(context.Background(), CliLimit)
	defer cancel()
	post, err := http.NewRequestWithContext(ctx, http.MethodPost, "http://journal/cli", bytes.NewReader(body))
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode, 0
	}
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
	if _, err := io.Copy(stdout, response.Body); err != nil {
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

// DirectRun runs the command line in a Python process of its own, as the journal ran before the server.
func DirectRun(home string, argv []string, stdout, stderr io.Writer) int {
	source := SourceFolder(home)
	command := exec.Command(PythonPath(), append([]string{filepath.Join(source, "core", "journal.py")}, argv...)...)
	command.Env = append(os.Environ(), "JOURNAL_HOME="+home)
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

// JournalHome is the journal's folder: JOURNAL_HOME when set, else .journal in the working folder, made absolute.
func JournalHome() string {
	home := os.Getenv("JOURNAL_HOME")
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
