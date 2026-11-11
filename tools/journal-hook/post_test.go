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

	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
)

// fakeTransport stands in for the journal's server: it answers each request it is handed with what reply gives.
type fakeTransport func(request *http.Request) (*http.Response, error)

func (reply fakeTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	return reply(request)
}

func answer(status int, text string) fakeTransport {
	return func(*http.Request) (*http.Response, error) {
		return &http.Response{StatusCode: status, Body: io.NopCloser(strings.NewReader(text))}, nil
	}
}

// late answers only after the hook has stopped waiting.
var late fakeTransport = func(request *http.Request) (*http.Response, error) {
	select {
	case <-request.Context().Done():
		return nil, request.Context().Err()
	case <-time.After(5 * time.Second):
		return nil, errors.New("the test waited too long")
	}
}

var unreachable fakeTransport = func(*http.Request) (*http.Response, error) {
	return nil, errors.New("connection refused")
}

func project(t *testing.T, port string) string {
	t.Helper()
	root := t.TempDir()
	writeFile(t, filepath.Join(root, ".journal", "src", "journal", "version.py"), "VERSION = \"5.0.1\"\n")
	if port != "" {
		writeFile(t, filepath.Join(root, ".journal", "port"), port+"\n")
		writeFile(t, filepath.Join(root, ".journal", versionFourSwitchName), "")
	}
	return root
}

func sample(root, eventName string) delivery {
	return delivery{root: root, program: "claude", event: eventName, environment: "development", actor: "worker:12", actorToken: "token-1",
		launch: "launch-3", firing: "7731-1793395000123", firedAtMs: 1793395000123, body: []byte(`{"version":1}`), limit: 200 * time.Millisecond,
		timing: timing.Started()}
}

func TestTheObjectIsPostedWithTheHeadersHookShSends(t *testing.T) {
	root := project(t, "8431")
	var captured *http.Request
	var body string
	status, answered := post(sample(root, "pre_tool_use"), fakeTransport(func(request *http.Request) (*http.Response, error) {
		captured = request
		text, _ := io.ReadAll(request.Body)
		body = string(text)
		return answer(200, `{"decision":"go"}`)(request)
	}), time.Unix(1793395000, 0))
	if status != 200 || string(answered) != `{"decision":"go"}` {
		t.Fatalf("status %d answer %s", status, answered)
	}
	if captured.URL.String() != "http://127.0.0.1:8431/hooks/claude" || captured.Method != http.MethodPost || body != `{"version":1}` {
		t.Errorf("posted %s %s with %s", captured.Method, captured.URL, body)
	}
	for name, want := range map[string]string{"Content-Type": "application/json", "X-Journal-Env": "development", "X-Journal-Project": root, "X-Journal-Launch": "launch-3",
		"X-Journal-Actor": "worker:12", "X-Journal-Actor-Token": "token-1", "X-Journal-Request-At": "1793395000123", "X-Journal-Hook-Id": "7731-1793395000123"} {
		if actual := captured.Header.Get(name); actual != want {
			t.Errorf("%s is %q, want %q", name, actual, want)
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
		writeFile(t, filepath.Join(root, ".journal", versionFourSwitchName), "")
		started := time.Now()
		status, _ := post(sample(root, "pre_tool_use"), setting.transport, time.Unix(1793395000, 0))
		if status == 200 || status == 409 {
			t.Errorf("%s: status %d", name, status)
		}
		if waited := time.Since(started); waited > 2*time.Second {
			t.Errorf("%s: waited %s past its limit", name, waited)
		}
		if actual := read(t, filepath.Join(root, ".journal", "runtime", "bypass.log")); actual != "1793395000 hook claude\n" {
			t.Errorf("%s: bypass.log holds %q", name, actual)
		}
	}
}

func TestASessionStartStampsTheVersionItStartedOn(t *testing.T) {
	root := project(t, "8431")
	post(sample(root, "session_start"), answer(200, "{}"), time.Unix(1, 0))
	if actual := read(t, filepath.Join(root, ".journal", "runtime", "session-version")); actual != "SessionStart 5.0.1\n" {
		t.Errorf("session-version holds %q", actual)
	}
}

func TestEachEventWaitsAsLongAsHookShLetsIt(t *testing.T) {
	for eventName, want := range map[string]time.Duration{"pre_tool_use": 5 * time.Second, "post_tool_use": 5 * time.Second, "prompt": 8 * time.Second,
		"stop": 10 * time.Second, "session_start": 15 * time.Second, "compact": 5 * time.Second} {
		if actual := LimitFor(eventName); actual != want {
			t.Errorf("%s waits %s, want %s", eventName, actual, want)
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

func switchedProject(t *testing.T) string {
	t.Helper()
	return project(t, "")
}

func timingNames(text string) []string {
	var stampNames []string
	for _, pair := range strings.Split(text, ";") {
		name, _, _ := strings.Cut(pair, "=")
		stampNames = append(stampNames, name)
	}
	return stampNames
}

func TestAJournalSwitchedToVersion5TakesTheHookOnItsSocketWithItsTiming(t *testing.T) {
	root := switchedProject(t)
	var captured *http.Request
	status, _ := post(sample(root, "pre_tool_use"), fakeTransport(func(request *http.Request) (*http.Response, error) {
		captured = request
		return answer(200, "{}")(request)
	}), time.Unix(1793395000, 0))
	if status != 200 || captured.URL.String() != "http://journal/hook?program=claude" || captured.Header.Get("X-Journal-Hook-Id") != "7731-1793395000123" {
		t.Fatalf("status %d, posted to %s", status, captured.URL)
	}
	if actual := timingNames(captured.Header.Get(timing.Header)); strings.Join(actual, ";") != "go_start;go_sent" {
		t.Errorf("timing names %v", actual)
	}
}

func TestAVersion4JournalSendsNoTiming(t *testing.T) {
	root := project(t, "8431")
	var captured *http.Request
	post(sample(root, "pre_tool_use"), fakeTransport(func(request *http.Request) (*http.Response, error) {
		captured = request
		return answer(200, "{}")(request)
	}), time.Unix(1, 0))
	if captured.Header.Get(timing.Header) != "" {
		t.Errorf("version 4 was sent a timing")
	}
}

func TestAGiveUpOnTheSocketAddsItsTimingToItsBypassLine(t *testing.T) {
	root := switchedProject(t)
	outgoing := sample(root, "pre_tool_use")
	post(outgoing, unreachable, time.Unix(1793395000, 0))
	fields := strings.Fields(read(t, filepath.Join(root, ".journal", "runtime", "bypass.log")))
	if len(fields) != 5 || strings.Join(fields[:3], " ") != "1793395000 hook claude" || fields[3] != outgoing.timing.RequestID() {
		t.Fatalf("bypass line %v", fields)
	}
	if actual := timingNames(fields[4]); strings.Join(actual, ";") != "go_start;go_sent;go_gave_up" {
		t.Errorf("timing names %v", actual)
	}
}

func TestAStopTheJournalDoesNotAnswerAtFirstIsAskedAgainUntilItDoes(t *testing.T) {
	root := project(t, "8431")
	askCount := 0
	transport := fakeTransport(func(request *http.Request) (*http.Response, error) {
		askCount++
		if askCount < 3 {
			return nil, errors.New("connection refused")
		}
		return answer(200, `{"decision":"block"}`)(request)
	})
	status, answered := postedUntilAnswered(sample(root, "stop"), transport, time.Unix(1793395000, 0), time.Second, time.Millisecond)
	if status != 200 || string(answered) != `{"decision":"block"}` || askCount != 3 {
		t.Fatalf("askCount %d times, status %d answer %s", askCount, status, answered)
	}
}

func TestAStopTheJournalNeverAnswersEndsWithoutAnswerAfterTheWindow(t *testing.T) {
	root := project(t, "8431")
	started := time.Now()
	status, _ := postedUntilAnswered(sample(root, "stop"), unreachable, time.Unix(1793395000, 0), 50*time.Millisecond, 5*time.Millisecond)
	if status != 0 || time.Since(started) < 50*time.Millisecond {
		t.Fatalf("status %d after %s", status, time.Since(started))
	}
	if holdAnswer := heldStop(); !strings.Contains(holdAnswer, `"decision":"block"`) || !strings.Contains(holdAnswer, "did not answer") {
		t.Fatalf("the holdAnswer stop says %s", holdAnswer)
	}
}

func TestAToolIsNotAskedAgainWhenTheJournalDoesNotAnswer(t *testing.T) {
	root := project(t, "8431")
	askCount := 0
	transport := fakeTransport(func(*http.Request) (*http.Response, error) {
		askCount++
		return nil, errors.New("connection refused")
	})
	postedUntilAnswered(sample(root, "pre_tool_use"), transport, time.Unix(1793395000, 0), time.Second, time.Millisecond)
	if askCount != 1 {
		t.Fatalf("a tool was askCount %d times", askCount)
	}
}

func TestAStopAnsweredWithAConflictIsAskedAgainUntilTheWindowEnds(t *testing.T) {
	asks := 0
	var transport fakeTransport = func(request *http.Request) (*http.Response, error) {
		asks++
		return answer(http.StatusConflict, "{}")(request)
	}
	root := project(t, "8431")
	status, _ := postedUntilAnswered(delivery{root: root, program: "claude", event: "stop", limit: time.Second, timing: &timing.Timing{}}, transport, time.Now(), 30*time.Millisecond, 5*time.Millisecond)
	if status == http.StatusOK || asks < 2 {
		t.Fatalf("status %d after %d asks", status, asks)
	}
}

func TestTheStopWindowEndsBeforeTheProgramsHookTimeoutWithAnAskToSpare(t *testing.T) {
	if StopWindow+LimitFor("stop") >= 60*time.Second {
		t.Fatalf("a stop may take %s, past the hook timeout of 60 seconds", StopWindow+LimitFor("stop"))
	}
}

func TestAWorkersOrHelpersHookWaitsInTheQueueAndAMainAgentsDoesNot(t *testing.T) {
	root := t.TempDir()
	for _, role := range []string{"worker", "helper"} {
		for _, eventName := range []string{"pre_tool_use", "post_tool_use", "stop", "prompt"} {
			if limit := limitOf(root, eventName, role); limit != agentHookWait {
				t.Fatalf("%s %s waits %s, not %s", role, eventName, limit, agentHookWait)
			}
		}
	}
	for _, role := range []string{"", "main"} {
		if limit := limitOf(root, "pre_tool_use", role); limit != 5*time.Second {
			t.Fatalf("a main agent's tool waits %s", limit)
		}
	}
	if agentHookWait >= 60*time.Second {
		t.Fatalf("%s is past the hook timeout of 60 seconds", agentHookWait)
	}
}

func TestLimitInUsesTheWaitSetForAToolAndNothingElse(t *testing.T) {
	root := t.TempDir()
	runtime := filepath.Join(root, ".journal", "runtime")
	if err := os.MkdirAll(runtime, 0o755); err != nil {
		t.Fatal(err)
	}
	if limitIn(root, "pre_tool_use") != 5*time.Second {
		t.Fatal("with no file a tool's hook waits the standard five seconds")
	}
	for text, expected := range map[string]time.Duration{"12\n": 12 * time.Second, "nonsense": 5 * time.Second, "0": 5 * time.Second} {
		if err := os.WriteFile(filepath.Join(runtime, "hook-wait-seconds"), []byte(text), 0o644); err != nil {
			t.Fatal(err)
		}
		if limit := limitIn(root, "pre_tool_use"); limit != expected {
			t.Fatalf("%q gave %s, not %s", text, limit, expected)
		}
	}
	if err := os.WriteFile(filepath.Join(runtime, "hook-wait-seconds"), []byte("12"), 0o644); err != nil {
		t.Fatal(err)
	}
	if limitIn(root, "stop") != 10*time.Second {
		t.Fatal("a stop keeps its own wait")
	}
}

func TestAStopNeverAnsweredIsNotNotedAsBypassed(t *testing.T) {
	root := switchedProject(t)
	postedUntilAnswered(sample(root, "stop"), unreachable, time.Unix(1793395000, 0), 3*time.Millisecond, time.Millisecond)
	if _, err := os.Stat(filepath.Join(root, ".journal", "runtime", "bypass.log")); err == nil {
		t.Errorf("a held stop was noted as going through unchecked")
	}
}

func TestAWorkersOrHelpersToolTheJournalDoesNotAnswerIsNotNotedAsBypassed(t *testing.T) {
	for _, role := range []string{"worker", "helper", "reviewer"} {
		root := project(t, "8431")
		writeFile(t, filepath.Join(root, ".journal", versionFourSwitchName), "")
		outgoing := sample(root, "pre_tool_use")
		outgoing.role = role
		post(outgoing, unreachable, time.Unix(1793395000, 0))
		if _, err := os.Stat(filepath.Join(root, ".journal", "runtime", "bypass.log")); err == nil {
			t.Errorf("a %s's refused tool was noted as going around the journal", role)
		}
	}
}

func TestOnlyAMainAgentsHookGoesOnWithoutTheJournal(t *testing.T) {
	cases := map[string]bool{"worker": true, "helper": true, "reviewer": true, "main": false, "": false}
	for role, wanted := range cases {
		if mustBeChecked(role) != wanted {
			t.Errorf("a hook of role %q must be checked: %v", role, !wanted)
		}
	}
}
