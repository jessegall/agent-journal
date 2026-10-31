package main

import (
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

// answering stands in for the journal's server: it answers each request it is handed with what reply gives.
type answering func(request *http.Request) (*http.Response, error)

func (reply answering) RoundTrip(request *http.Request) (*http.Response, error) {
	return reply(request)
}

func answer(status int, text string) answering {
	return func(*http.Request) (*http.Response, error) {
		return &http.Response{StatusCode: status, Body: io.NopCloser(strings.NewReader(text))}, nil
	}
}

// late answers only after the hook has stopped waiting.
var late answering = func(request *http.Request) (*http.Response, error) {
	select {
	case <-request.Context().Done():
		return nil, request.Context().Err()
	case <-time.After(5 * time.Second):
		return nil, errors.New("the test waited too long")
	}
}

var unreachable answering = func(*http.Request) (*http.Response, error) {
	return nil, errors.New("connection refused")
}

func project(t *testing.T, port string) string {
	t.Helper()
	root := t.TempDir()
	write(t, filepath.Join(root, ".journal", "src", "journal", "version.py"), "VERSION = \"5.0.1\"\n")
	if port != "" {
		write(t, filepath.Join(root, ".journal", "port"), port+"\n")
	}
	return root
}

func sample(root, eventName string) delivery {
	return delivery{root: root, program: "claude", event: eventName, environment: "development", actor: "worker:12", actorToken: "token-1",
		launch: "launch-3", firing: "7731-1793395000123", firedAtMs: 1793395000123, body: []byte(`{"version":1}`), limit: 200 * time.Millisecond}
}

func TestTheObjectIsPostedWithTheHeadersHookShSends(t *testing.T) {
	root := project(t, "8431")
	var seen *http.Request
	var body string
	status, answered := post(sample(root, "pre_tool_use"), answering(func(request *http.Request) (*http.Response, error) {
		seen = request
		text, _ := io.ReadAll(request.Body)
		body = string(text)
		return answer(200, `{"decision":"go"}`)(request)
	}), time.Unix(1793395000, 0))
	if status != 200 || string(answered) != `{"decision":"go"}` {
		t.Fatalf("status %d answer %s", status, answered)
	}
	if seen.URL.String() != "http://127.0.0.1:8431/hooks/claude" || seen.Method != http.MethodPost || body != `{"version":1}` {
		t.Errorf("posted %s %s with %s", seen.Method, seen.URL, body)
	}
	for name, want := range map[string]string{"Content-Type": "application/json", "X-Journal-Env": "development", "X-Journal-Project": root, "X-Journal-Launch": "launch-3",
		"X-Journal-Actor": "worker:12", "X-Journal-Actor-Token": "token-1", "X-Journal-Request-At": "1793395000123", "X-Journal-Hook-Id": "7731-1793395000123"} {
		if got := seen.Header.Get(name); got != want {
			t.Errorf("%s is %q, want %q", name, got, want)
		}
	}
	if read(t, filepath.Join(root, ".journal", "runtime", "hooks", "development.fired")) != "1793395000\n" {
		t.Error("the firing time was not stamped")
	}
	if _, err := os.Stat(filepath.Join(root, ".journal", "runtime", "bypass.log")); err == nil {
		t.Error("an answered hook was noted as gone around")
	}
}

func TestARefusalIsTheJournalsAnswer(t *testing.T) {
	root := project(t, "8431")
	status, answered := post(sample(root, "pre_tool_use"), answer(409, `{"error": "no"}`), time.Unix(1, 0))
	if status != 409 || string(answered) != `{"error": "no"}` {
		t.Errorf("status %d answer %s", status, answered)
	}
	if _, err := os.Stat(filepath.Join(root, ".journal", "runtime", "bypass.log")); err == nil {
		t.Error("a refusal was noted as gone around")
	}
}

func TestAHookTheJournalDoesNotAnswerInTimeGoesOnAndIsNoted(t *testing.T) {
	cases := map[string]struct {
		port      string
		transport http.RoundTripper
	}{
		"a late answer":       {"8431", late},
		"no server listening": {"8431", unreachable},
		"no port written":     {"", answer(200, "{}")},
		"an error answer":     {"8431", answer(500, "boom")},
	}
	for name, setting := range cases {
		root := project(t, setting.port)
		began := time.Now()
		status, _ := post(sample(root, "pre_tool_use"), setting.transport, time.Unix(1793395000, 0))
		if status == 200 || status == 409 {
			t.Errorf("%s: status %d", name, status)
		}
		if waited := time.Since(began); waited > 2*time.Second {
			t.Errorf("%s: waited %s past its limit", name, waited)
		}
		if got := read(t, filepath.Join(root, ".journal", "runtime", "bypass.log")); got != "1793395000 hook claude\n" {
			t.Errorf("%s: bypass.log holds %q", name, got)
		}
	}
}

func TestASessionStartStampsTheVersionItStartedOn(t *testing.T) {
	root := project(t, "8431")
	post(sample(root, "session_start"), answer(200, "{}"), time.Unix(1, 0))
	if got := read(t, filepath.Join(root, ".journal", "runtime", "session-version")); got != "SessionStart 5.0.1\n" {
		t.Errorf("session-version holds %q", got)
	}
}

func TestEachEventWaitsAsLongAsHookShLetsIt(t *testing.T) {
	for eventName, want := range map[string]time.Duration{"pre_tool_use": 5 * time.Second, "post_tool_use": 5 * time.Second, "prompt": 8 * time.Second,
		"stop": 10 * time.Second, "subagent_stop": 10 * time.Second, "session_start": 15 * time.Second, "compact": 5 * time.Second} {
		if got := LimitFor(eventName); got != want {
			t.Errorf("%s waits %s, want %s", eventName, got, want)
		}
	}
}

func read(t *testing.T, path string) string {
	t.Helper()
	text, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(text)
}
