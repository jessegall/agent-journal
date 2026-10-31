package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// How long the hook waits for the journal's server to take the connection, as hook.sh's curl --connect-timeout 1.
const connectLimit = time.Second

// socketSwitchName is the file version 5's install writes in the journal's folder, so hooks go to version 5's socket
// instead of version 4's port.
const socketSwitchName = "hooks-on-socket"

// LimitFor is how long the hook waits for the journal's answer before it goes on without it, as hook.sh's
// ANSWER_SECONDS: a session start may wait on a boot, a stop and a prompt may wait on a decision, a tool waits least.
func LimitFor(eventName string) time.Duration {
	switch eventName {
	case "prompt":
		return 8 * time.Second
	case "stop", "subagent_stop":
		return 10 * time.Second
	case "session_start":
		return 15 * time.Second
	}
	return 5 * time.Second
}

// delivery is one hook on its way to the journal: where it goes, who sends it, the prepared object, and the timing
// main started.
type delivery struct {
	root        string
	program     string
	event       string
	environment string
	actor       string
	actorToken  string
	launch      string
	firing      string
	firedAtMs   int64
	body        []byte
	limit       time.Duration
	timing      *timing.Timing
}

// post sends the hook to the server of the project at root, as hook.sh does: it first stamps the time the hook fired,
// and the version a session start runs on, then posts within the limit; a hook the server does not answer with 200 or
// 409 in time goes on without it and is noted in bypass.log. The transport is the network's, or a test's. Once
// version 5's install has set the switch, the hook goes to /hook on version 5's socket with its timing.
func post(outgoing delivery, transport http.RoundTripper, firedTime time.Time) (status int, answer []byte) {
	stamped(outgoing, firedTime)
	status, answer = posted(outgoing, transport)
	if status != http.StatusOK && status != http.StatusConflict {
		noteBypass(outgoing, firedTime)
	}
	return status, answer
}

func posted(outgoing delivery, transport http.RoundTripper) (int, []byte) {
	address, ownTransport, hasAddress := destination(outgoing)
	if !hasAddress {
		return 0, nil
	}
	if transport == nil {
		transport = ownTransport
	}
	limit, cancel := context.WithTimeout(context.Background(), outgoing.limit)
	defer cancel()
	request, err := http.NewRequestWithContext(limit, http.MethodPost, address, bytes.NewReader(outgoing.body))
	if err != nil {
		return 0, nil
	}
	for name, value := range map[string]string{
		"Content-Type":          "application/json",
		"X-Journal-Env":         outgoing.environment,
		"X-Journal-Project":     outgoing.root,
		"X-Journal-Launch":      outgoing.launch,
		"X-Journal-Actor":       outgoing.actor,
		"X-Journal-Actor-Token": outgoing.actorToken,
		"X-Journal-Request-At":  strconv.FormatInt(outgoing.firedAtMs, 10),
		"X-Journal-Hook-Id":     outgoing.firing,
	} {
		request.Header.Set(name, value)
	}
	if outgoing.onSocket() {
		outgoing.timing.Stamp("go_sent")
		request.Header.Set(timing.Header, outgoing.timing.Text())
	}
	response, err := (&http.Client{Transport: transport}).Do(request)
	if err != nil {
		return 0, nil
	}
	defer response.Body.Close()
	answer, err := io.ReadAll(response.Body)
	if err != nil {
		return 0, nil
	}
	return response.StatusCode, answer
}

// onSocket says whether version 5's install has set the switch that sends hooks to its socket.
func (outgoing delivery) onSocket() bool {
	_, err := os.Stat(filepath.Join(outgoing.root, ".journal", socketSwitchName))
	return err == nil
}

// destination is the address the hook is posted to and the transport that reaches it: /hook on version 5's socket
// once the switch is set, else version 4's port; there is none when version 4 has written no port.
func destination(outgoing delivery) (string, http.RoundTripper, bool) {
	if outgoing.onSocket() {
		address := "http://journal/hook?program=" + url.QueryEscape(outgoing.program)
		return address, socket.Transport(socket.Path(filepath.Join(outgoing.root, ".journal"))), true
	}
	port, err := os.ReadFile(filepath.Join(outgoing.root, ".journal", "port"))
	if err != nil || strings.TrimSpace(string(port)) == "" {
		return "", nil, false
	}
	address := fmt.Sprintf("http://127.0.0.1:%s/hooks/%s", strings.TrimSpace(string(port)), outgoing.program)
	return address, &http.Transport{DialContext: (&net.Dialer{Timeout: connectLimit}).DialContext}, true
}

// The version a running journal reports, from its version.py: VERSION = "4.69.9".
var versionLine = regexp.MustCompile(`(?m)^VERSION = "(.*)"`)

// stamped writes the time of every hook that goes to the server, which the server's health compares with the last
// hook it took, and, for a session start, the version the agent started on.
func stamped(outgoing delivery, firedTime time.Time) {
	hooks := filepath.Join(outgoing.root, ".journal", "runtime", "hooks")
	if os.MkdirAll(hooks, 0o755) == nil {
		_ = os.WriteFile(filepath.Join(hooks, outgoing.environment+".fired"), []byte(strconv.FormatInt(firedTime.Unix(), 10)+"\n"), 0o644)
	}
	if outgoing.event != "session_start" {
		return
	}
	version := ""
	if text, err := os.ReadFile(filepath.Join(outgoing.root, ".journal", "src", "journal", "version.py")); err == nil {
		if captured := versionLine.FindSubmatch(text); captured != nil {
			version = string(captured[1])
		}
	}
	_ = os.WriteFile(filepath.Join(outgoing.root, ".journal", "runtime", "session-version"), []byte("SessionStart "+version+"\n"), 0o644)
}

// noteBypass appends the hook that went around the journal to bypass.log, for the journal to say once it is back;
// a hook sent to version 5's socket adds its request id and its timing, ending with go_gave_up, to the same line.
func noteBypass(outgoing delivery, firedTime time.Time) {
	log, err := os.OpenFile(filepath.Join(outgoing.root, ".journal", "runtime", "bypass.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer log.Close()
	line := fmt.Sprintf("%d hook %s", firedTime.Unix(), outgoing.program)
	if outgoing.onSocket() {
		outgoing.timing.Stamp("go_gave_up")
		line += " " + outgoing.timing.RequestID() + " " + outgoing.timing.Text()
	}
	fmt.Fprintln(log, line)
}
