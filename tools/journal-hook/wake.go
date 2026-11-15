package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"path/filepath"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// The ways a program is woken by its wake hook's answer, as the program table names them.
const (
	wakeExitWithStderr  = "exit_with_stderr"
	wakeBlockWithReason = "block_with_reason"
)

// wakeWait is one wake waiter: the hook entry a program runs in the background at a stop, which waits on the journal's
// server for a line that wakes the agent and answers with it in the program's own shape. It never starts the server.
type wakeWait struct {
	row         programs.Program
	payload     map[string]string
	transport   http.RoundTripper
	askLimit    time.Duration
	retryPause  time.Duration
	goneLimit   time.Duration
	endsBefore  time.Duration
	startedAt   time.Time
	waitSeconds int
}

// wakeLine is the server's answer to a waiter: the line's text, its row and the waiter's token.
type wakeLine struct {
	Line   string `json:"line"`
	LineID int64  `json:"line_id"`
	Token  string `json:"token"`
}

// Wake runs the wake hook of program for the project at root: the hook body on stdin, the line, if one comes, on stdout
// or stderr as the program reads it, and the exit code the program wakes on.
func Wake(stdin io.Reader, stdout, stderr io.Writer, getenv func(string) string, program, root, folder string) int {
	body, err := io.ReadAll(stdin)
	if err != nil {
		return 0
	}
	hook, skip := hookContext(getenv, root, folder, 0, time.Now())
	if skip || Panicking(root, hook.Role) {
		return 0
	}
	row := hook.Programs.Programs[program]
	launch := getenv("JOURNAL_LAUNCH")
	if row.WakeAnswer == "" || (!IsMainRole(hook.Role) && launch == "") {
		return 0
	}
	var fields struct {
		Session string `json:"session_id"`
	}
	json.Unmarshal(body, &fields)
	waiter := wakeWait{
		row:         row,
		payload:     map[string]string{"program": program, "session": fields.Session, "launch": launch, "role": hook.Role, "actor": hook.Actor, "environment": hook.Environment, "token": waiterToken()},
		transport:   socket.Transport(socket.Path(filepath.Join(root, ".journal"))),
		askLimit:    maxToolWait,
		retryPause:  5 * time.Second,
		goneLimit:   60 * time.Second,
		endsBefore:  30 * time.Second,
		startedAt:   time.Now(),
		waitSeconds: row.WakeSeconds,
	}
	return waiter.waited(stdout, stderr)
}

// waited asks the server for a line until one comes, the wait is cancelled, the server is gone for too long or the
// hook's own timeout comes near; only a line the server confirmed is printed.
func (waiter wakeWait) waited(stdout, stderr io.Writer) int {
	ends := waiter.startedAt.Add(time.Duration(waiter.waitSeconds)*time.Second - waiter.endsBefore)
	var goneSince time.Time
	for time.Now().Before(ends) {
		status, answer := waiter.asked("http://journal/wake", waiter.payload, min(waiter.askLimit, time.Until(ends)))
		switch status {
		case http.StatusOK:
			return waiter.answered(stdout, stderr, answer)
		case http.StatusNoContent:
			goneSince = time.Time{}
		case 0:
			if goneSince.IsZero() {
				goneSince = time.Now()
			}
			if time.Since(goneSince) >= waiter.goneLimit {
				return 0
			}
			time.Sleep(min(waiter.retryPause, max(0, time.Until(ends))))
		default:
			return 0
		}
	}
	return 0
}

// answered confirms the line the server gave and prints it in the program's shape; a confirm that fails prints nothing,
// and the server gives the line again later.
func (waiter wakeWait) answered(stdout, stderr io.Writer, answer []byte) int {
	var line wakeLine
	if json.Unmarshal(answer, &line) != nil || line.Line == "" {
		return 0
	}
	received := map[string]any{"line_id": line.LineID, "token": waiter.payload["token"]}
	if status, _ := waiter.asked("http://journal/wake/received", received, waiter.askLimit); status != http.StatusOK {
		return 0
	}
	switch waiter.row.WakeAnswer {
	case wakeExitWithStderr:
		io.WriteString(stderr, line.Line)
		return 2
	case wakeBlockWithReason:
		io.WriteString(stdout, jsonText(map[string]any{"decision": "block", "reason": line.Line}))
	}
	return 0
}

// asked posts the fields to the address and gives the status and the body, or status 0 when the server is not reached.
func (waiter wakeWait) asked(address string, fields any, limit time.Duration) (int, []byte) {
	text, _ := json.Marshal(fields)
	deadline, cancel := context.WithTimeout(context.Background(), limit)
	defer cancel()
	request, err := http.NewRequestWithContext(deadline, http.MethodPost, address, bytes.NewReader(text))
	if err != nil {
		return 0, nil
	}
	request.Header.Set("Content-Type", "application/json")
	response, err := (&http.Client{Transport: waiter.transport}).Do(request)
	if err != nil {
		return 0, nil
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return 0, nil
	}
	return response.StatusCode, body
}

// waiterToken is a random token that names one waiter to the server, so a later waiter replaces it.
func waiterToken() string {
	bytes := make([]byte, 16)
	_, _ = rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
