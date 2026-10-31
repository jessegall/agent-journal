package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// How long the hook waits for the journal's server to take the connection, as hook.sh's curl --connect-timeout 1.
const connectLimit = time.Second

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

// delivery is one hook on its way to the journal: where it goes, who sends it, and the prepared object.
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
}

// post sends the hook to the server of the project at root, as hook.sh does: it first stamps the time the hook fired,
// and the version a session start runs on, then posts within the limit; a hook the server does not answer with 200 or
// 409 in time goes on without it and is noted in bypass.log. The transport is the network's, or a test's.
func post(sent delivery, transport http.RoundTripper, now time.Time) (status int, answer []byte) {
	stamped(sent, now)
	status, answer = posted(sent, transport)
	if status != http.StatusOK && status != http.StatusConflict {
		noteBypass(sent.root, sent.program, now)
	}
	return status, answer
}

func posted(sent delivery, transport http.RoundTripper) (int, []byte) {
	port, err := os.ReadFile(filepath.Join(sent.root, ".journal", "port"))
	if err != nil || strings.TrimSpace(string(port)) == "" {
		return 0, nil
	}
	if transport == nil {
		transport = &http.Transport{DialContext: (&net.Dialer{Timeout: connectLimit}).DialContext}
	}
	limit, cancel := context.WithTimeout(context.Background(), sent.limit)
	defer cancel()
	address := fmt.Sprintf("http://127.0.0.1:%s/hooks/%s", strings.TrimSpace(string(port)), sent.program)
	request, err := http.NewRequestWithContext(limit, http.MethodPost, address, bytes.NewReader(sent.body))
	if err != nil {
		return 0, nil
	}
	for name, value := range map[string]string{
		"Content-Type":          "application/json",
		"X-Journal-Env":         sent.environment,
		"X-Journal-Project":     sent.root,
		"X-Journal-Launch":      sent.launch,
		"X-Journal-Actor":       sent.actor,
		"X-Journal-Actor-Token": sent.actorToken,
		"X-Journal-Request-At":  strconv.FormatInt(sent.firedAtMs, 10),
		"X-Journal-Hook-Id":     sent.firing,
	} {
		request.Header.Set(name, value)
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

// The version a running journal reports, from its version.py: VERSION = "4.69.9".
var versionLine = regexp.MustCompile(`(?m)^VERSION = "(.*)"`)

// stamped writes the time of every hook that goes to the server, which the server's health compares with the last
// hook it took, and, for a session start, the version the agent started on.
func stamped(sent delivery, now time.Time) {
	hooks := filepath.Join(sent.root, ".journal", "runtime", "hooks")
	if os.MkdirAll(hooks, 0o755) == nil {
		_ = os.WriteFile(filepath.Join(hooks, sent.environment+".fired"), []byte(strconv.FormatInt(now.Unix(), 10)+"\n"), 0o644)
	}
	if sent.event != "session_start" {
		return
	}
	version := ""
	if text, err := os.ReadFile(filepath.Join(sent.root, ".journal", "src", "journal", "version.py")); err == nil {
		if found := versionLine.FindSubmatch(text); found != nil {
			version = string(found[1])
		}
	}
	_ = os.WriteFile(filepath.Join(sent.root, ".journal", "runtime", "session-version"), []byte("SessionStart "+version+"\n"), 0o644)
}

// noteBypass appends the hook that went around the journal to bypass.log, for the journal to say once it is back.
func noteBypass(root, program string, now time.Time) {
	log, err := os.OpenFile(filepath.Join(root, ".journal", "runtime", "bypass.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer log.Close()
	fmt.Fprintf(log, "%d hook %s\n", now.Unix(), program)
}
