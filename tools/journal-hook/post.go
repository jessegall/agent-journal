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
	"os/exec"
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

// versionFourSwitchName is the file a restore to version 4 writes in the journal's folder, so hooks go to version 4's
// port instead of version 5's socket; a project with no such file is on version 5.
const versionFourSwitchName = "hooks-on-version-4"

// restartMarkName is the file a server writes in the journal's folder when it stops for new code; the next server
// removes it once it takes requests.
const restartMarkName = "server-restarting"

// maxToolWait caps the wait a person sets for a tool's hook, so one more ask after RestartWindow stays inside the
// program's hook timeout of 90 seconds and the program never kills the hook mid-wait.
const maxToolWait = 25 * time.Second

// restartTimedOut is the status post gives a hook whose restarting server did not come back within RestartWindow.
const restartTimedOut = http.StatusGatewayTimeout

// RestartWindow is how long a hook waits for a restarting server. RestartMarkLimit is the age from which a mark counts
// as left by a server that crashed, later than the window, so a hook that waits the whole window ends with a timeout.
var (
	RestartWindow    = 60 * time.Second
	RestartMarkLimit = 2 * time.Minute
)

// RoleVariable is the variable the journal starts a worker's or helper's program with, so the hook knows the role without
// the server.
const RoleVariable = "JOURNAL_ROLE"

// checkRequired is the status a hook gets whose tool may not run unchecked and which the journal did not answer.
const checkRequired = http.StatusPreconditionRequired

// mustBeChecked says whether the hook is one of an agent that is not a main agent, whose hooks are never let through
// unchecked: when the journal does not answer in time the hook is held and the agent may try again. Only a main agent
// goes on when the journal does not answer.
func mustBeChecked(role string) bool {
	return role != "" && role != "main"
}

// LimitFor is how long the hook waits for the journal's answer before it goes on without it, as hook.sh's
// ANSWER_SECONDS: a session start may wait on a boot, a stop and a prompt may wait on a decision, a tool waits least.
func LimitFor(eventName string) time.Duration {
	switch eventName {
	case "prompt":
		return 8 * time.Second
	case "stop":
		return 10 * time.Second
	case "session_start":
		return 15 * time.Second
	}
	return 5 * time.Second
}

// limitIn is LimitFor with the wait the person set for a tool's hook, which the journal writes to a file, read here because
// the hook decides how long to wait before it can ask the journal anything.
func limitIn(root, eventName string) time.Duration {
	standard := LimitFor(eventName)
	if standard != 5*time.Second {
		return standard
	}
	text, err := os.ReadFile(filepath.Join(root, ".journal", "runtime", "hook-wait-seconds"))
	if err != nil {
		return standard
	}
	seconds, err := strconv.Atoi(strings.TrimSpace(string(text)))
	if err != nil || seconds < 1 {
		return standard
	}
	return min(time.Duration(seconds)*time.Second, maxToolWait)
}

// agentHookWait is how long a hook of a worker or helper waits in the journal's queue for its answer: it is never
// let through unchecked, so it waits rather than being refused, and stays below the 60 seconds a program gives a hook.
// The server allows 45 seconds, leaving five seconds to send its answer before this client gives up at 50.
const agentHookWait = 50 * time.Second

// limitOf is limitIn for the role that sends the hook: a worker's or helper's hook waits in the queue.
func limitOf(root, eventName, role string) time.Duration {
	if role == "" || role == "main" {
		return limitIn(root, eventName)
	}
	return agentHookWait
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
	role        string
	firing      string
	firedAtMs   int64
	retries     int
	body        []byte
	limit       time.Duration
	timing      *timing.Timing
}

// post sends the hook to the server of the project at root, as hook.sh does: it first stamps the time the hook fired,
// and the version a session start runs on, then posts within the limit; a hook the server does not answer with 200 or
// 409 in time goes on without it and is noted in bypass.log, unless the server is restarting, which it waits for, or the
// tool must be checked, which is refused and so bypasses nothing. The
// transport is the network's, or a test's. Once version 5's install has set the switch, the hook goes to /hook on
// version 5's socket with its timing.
func post(outgoing delivery, transport http.RoundTripper, firedTime time.Time) (status int, answer []byte) {
	stamped(outgoing, firedTime)
	status, answer = heldThroughRestart(outgoing, transport)
	if status != http.StatusOK && status != http.StatusConflict && status != restartTimedOut {
		if !mustBeChecked(outgoing.role) {
			noteBypass(outgoing, firedTime)
		}
		startMissingServer(outgoing.root)
	}
	return status, answer
}

// heldThroughRestart posts the hook, and while the server does not answer with 200 and its restart mark is there it
// asks again, resting between asks; every ask that waits starts the server when its socket is gone, since the server
// that is stopping may keep its socket past the first ask, and no other client may come.
func heldThroughRestart(outgoing delivery, transport http.RoundTripper) (int, []byte) {
	began := time.Now()
	status, answer := posted(outgoing, transport)
	for status != http.StatusOK && serverIsRestarting(outgoing.root) {
		if time.Since(began) >= RestartWindow {
			return restartTimedOut, nil
		}
		startMissingServer(outgoing.root)
		time.Sleep(RetryPause)
		status, answer = posted(outgoing, transport)
	}
	return status, answer
}

// serverIsRestarting says whether a server left its restart mark, not older than RestartMarkLimit.
func serverIsRestarting(root string) bool {
	markFile, err := os.Stat(filepath.Join(root, ".journal", restartMarkName))
	return err == nil && time.Since(markFile.ModTime()) < RestartMarkLimit
}

// serverStartMarkName is the file a client holds while the server it started boots, which the server removes once it
// holds its lock; while it is fresher than ServerStartPause a hook starts no client. See Connect in tools/journal.
const serverStartMarkName = "server-starting"

var ServerStartPause = 30 * time.Second

// startMissingServer starts the journal's server when its socket is gone, as any journal command does, without
// waiting for it: this hook goes on unchecked and the next finds a server, also while the agent runs no command.
func startMissingServer(root string) {
	home := filepath.Join(root, ".journal")
	if _, err := os.Stat(filepath.Join(home, "server.sock")); err == nil {
		return
	}
	marker := filepath.Join(home, serverStartMarkName)
	if file, err := os.Stat(marker); err == nil && time.Since(file.ModTime()) < ServerStartPause {
		return
	}
	_ = os.WriteFile(marker, nil, 0o600)
	command := exec.Command(filepath.Join(home, "bin", "journal"), "environment", "list")
	command.Env = append(os.Environ(), "JOURNAL_HOME="+home)
	if command.Start() == nil {
		_ = command.Process.Release()
	}
}

// StopWindow is how long a stop the journal does not answer with 200 is asked again before the hook holds it, shorter
// than the program's hook timeout by more than one ask, and RetryPause is how long it rests between two asks.
var (
	StopWindow = 40 * time.Second
	RetryPause = time.Second
)

// holdsStop says whether the event is a stop, which is never let through unchecked while the journal may be only slow.
func holdsStop(eventName string) bool {
	return eventName == "stop"
}

// postedUntilAnswered asks as post does; a stop the journal does not answer with 200 is asked again, resting between asks, until
// the window has passed, so a journal that stalls for seconds still holds the stop instead of letting it through.
func postedUntilAnswered(outgoing delivery, transport http.RoundTripper, firedTime time.Time, window, pause time.Duration) (int, []byte) {
	if !holdsStop(outgoing.event) {
		return post(outgoing, transport, firedTime)
	}
	began := time.Now()
	stamped(outgoing, firedTime)
	status, answer := posted(outgoing, transport)
	for status != http.StatusOK && time.Since(began) < window {
		time.Sleep(pause)
		outgoing.retries++
		if outgoing.onSocket() {
			outgoing.timing.Stamp(fmt.Sprintf("go_stop_retry_%d", outgoing.retries))
		}
		stamped(outgoing, firedTime)
		status, answer = posted(outgoing, transport)
	}
	return status, answer
}

// heldStop is the answer to a stop the journal never answered: the stop is held with the way to see why.
func heldStop() string {
	reason := "[journal] The journal did not answer this stop within 40 seconds, so the stop is held. Check it: curl -s --unix-socket .journal/server.sock http://journal/health should answer 200, and .journal/runtime/server.log says why it does not; then stop again."
	return jsonText(map[string]any{"decision": "block", "reason": reason})
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
	if outgoing.retries > 0 {
		request.Header.Set("X-Journal-Retries", strconv.Itoa(outgoing.retries))
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

// onSocket says whether hooks go to version 5's socket, which they do unless a restore to version 4 set its switch.
func (outgoing delivery) onSocket() bool {
	_, err := os.Stat(filepath.Join(outgoing.root, ".journal", versionFourSwitchName))
	return err != nil
}

// destination is the address the hook is posted to and the transport that reaches it: /hook on version 5's socket,
// else version 4's port once a restore set the switch; there is none when version 4 has written no port.
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
