package main

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// wakeServer stands in for the journal's wake routes: each ask of /wake takes the next of its answers, and every
// request it was handed is kept by its path.
type wakeServer struct {
	mutex    sync.Mutex
	answers  []fakeTransport
	received int
	paths    []string
	confirm  int
}

func (server *wakeServer) RoundTrip(request *http.Request) (*http.Response, error) {
	server.mutex.Lock()
	server.paths = append(server.paths, request.URL.Path)
	if request.URL.Path == "/wake/received" {
		server.received++
		server.mutex.Unlock()
		return answer(server.confirm, "")(request)
	}
	next := server.answers[0]
	if len(server.answers) > 1 {
		server.answers = server.answers[1:]
	}
	server.mutex.Unlock()
	return next(request)
}

const wakingLine = "[journal] new message 12: read it with journal message show 12"

func lineAnswer() fakeTransport {
	return answer(http.StatusOK, `{"line": "`+wakingLine+`", "line_id": 7, "token": "t"}`)
}

func testWaiter(wakeAnswer string, transport http.RoundTripper) wakeWait {
	return wakeWait{
		row:         programs.Program{WakeAnswer: wakeAnswer, WakeSeconds: 86_400},
		payload:     map[string]string{"program": "claude", "session": "s-1", "token": "t"},
		transport:   transport,
		askLimit:    time.Second,
		retryPause:  10 * time.Millisecond,
		goneLimit:   100 * time.Millisecond,
		endsBefore:  30 * time.Second,
		startedAt:   time.Now(),
		waitSeconds: 86_400,
	}
}

func woken(waiter wakeWait) (string, string, int) {
	var stdout, stderr strings.Builder
	code := waiter.waited(&stdout, &stderr)
	return stdout.String(), stderr.String(), code
}

func TestWakePrintsTheLineOnStderrAndExitsTwoForClaude(t *testing.T) {
	stdout, stderr, code := woken(testWaiter(wakeExitWithStderr, &wakeServer{answers: []fakeTransport{lineAnswer()}, confirm: http.StatusOK}))
	if stdout != "" || stderr != wakingLine || code != 2 {
		t.Fatalf("printed %q and %q with code %d", stdout, stderr, code)
	}
}

func TestWakePrintsABlockDecisionForCodex(t *testing.T) {
	stdout, stderr, code := woken(testWaiter(wakeBlockWithReason, &wakeServer{answers: []fakeTransport{lineAnswer()}, confirm: http.StatusOK}))
	var decision map[string]string
	json.Unmarshal([]byte(stdout), &decision)
	if decision["decision"] != "block" || decision["reason"] != wakingLine || stderr != "" || code != 0 {
		t.Fatalf("printed %q and %q with code %d", stdout, stderr, code)
	}
}

func TestWakeConfirmsBeforePrinting(t *testing.T) {
	server := &wakeServer{answers: []fakeTransport{lineAnswer()}, confirm: http.StatusOK}
	woken(testWaiter(wakeExitWithStderr, server))
	if strings.Join(server.paths, " ") != "/wake /wake/received" {
		t.Fatalf("the waiter asked %v", server.paths)
	}
}

func TestWakeAsksAgainOnNothingYet(t *testing.T) {
	nothing := answer(http.StatusNoContent, "")
	server := &wakeServer{answers: []fakeTransport{nothing, nothing, lineAnswer()}, confirm: http.StatusOK}
	if _, stderr, code := woken(testWaiter(wakeExitWithStderr, server)); stderr != wakingLine || code != 2 {
		t.Fatalf("printed %q with code %d after %v", stderr, code, server.paths)
	}
	if len(server.paths) != 4 {
		t.Fatalf("the waiter asked %v", server.paths)
	}
}

func TestWakeExitsZeroWhenCancelled(t *testing.T) {
	stdout, stderr, code := woken(testWaiter(wakeExitWithStderr, &wakeServer{answers: []fakeTransport{answer(http.StatusGone, "")}}))
	if stdout != "" || stderr != "" || code != 0 {
		t.Fatalf("printed %q and %q with code %d", stdout, stderr, code)
	}
}

func TestWakeDoesNotPrintWhenTheConfirmFails(t *testing.T) {
	stdout, stderr, code := woken(testWaiter(wakeExitWithStderr, &wakeServer{answers: []fakeTransport{lineAnswer()}, confirm: http.StatusGone}))
	if stdout != "" || stderr != "" || code != 0 {
		t.Fatalf("printed %q and %q with code %d", stdout, stderr, code)
	}
}

func TestWakeExitsZeroWhenTheServerIsGoneFor60Seconds(t *testing.T) {
	started := time.Now()
	if _, stderr, code := woken(testWaiter(wakeExitWithStderr, unreachable)); stderr != "" || code != 0 {
		t.Fatalf("printed %q with code %d", stderr, code)
	}
	if elapsed := time.Since(started); elapsed < 100*time.Millisecond || elapsed > 2*time.Second {
		t.Fatalf("a waiter with a 100 ms limit for a gone server waited %s", elapsed)
	}
}

func TestWakeStopsBeforeTheHookTimeout(t *testing.T) {
	waiter := testWaiter(wakeExitWithStderr, &wakeServer{answers: []fakeTransport{answer(http.StatusNoContent, "")}})
	waiter.waitSeconds = 31
	started := time.Now()
	if _, _, code := woken(waiter); code != 0 || time.Since(started) > 3*time.Second {
		t.Fatalf("a waiter of a 31 s entry ended with code %d after %s", code, time.Since(started))
	}
}

func TestWakeNeverStartsTheServer(t *testing.T) {
	root := t.TempDir()
	os.MkdirAll(filepath.Join(root, ".journal"), 0o755)
	waiter := testWaiter(wakeExitWithStderr, unreachable)
	woken(waiter)
	if _, err := os.Stat(filepath.Join(root, ".journal", serverStartMarkName)); err == nil {
		t.Fatal("the waiter started the server")
	}
}

// journalEnvironment is the environment of a hook the journal handles, for the given role and launch.
func journalEnvironment(role, launch string) func(string) string {
	values := map[string]string{"AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ACTOR": "agent", "JOURNAL_ENV": "development", RoleVariable: role, "JOURNAL_LAUNCH": launch}
	return func(name string) string { return values[name] }
}

// quickWake runs the whole wake hook and fails when it takes long, which it does only when it waits on a server.
func quickWake(t *testing.T, getenv func(string) string, program, root string) int {
	t.Helper()
	started := time.Now()
	var stdout, stderr strings.Builder
	code := Wake(strings.NewReader(`{"session_id":"s-1","hook_event_name":"Stop"}`), &stdout, &stderr, getenv, program, root, root)
	if time.Since(started) > time.Second || stdout.String() != "" || stderr.String() != "" {
		t.Fatalf("the wake hook waited %s and printed %q and %q", time.Since(started), stdout.String(), stderr.String())
	}
	return code
}

func TestWakeExitsZeroForAHelper(t *testing.T) {
	if code := quickWake(t, journalEnvironment("helper", ""), "claude", t.TempDir()); code != 0 {
		t.Fatalf("a headless helper's wake hook exited %d", code)
	}
}

func TestWakeExitsZeroInPanicMode(t *testing.T) {
	root := t.TempDir()
	writeFile(t, filepath.Join(root, ".journal", PanicFile), "why: a test\n")
	if code := quickWake(t, journalEnvironment("main", "s-1"), "claude", root); code != 0 {
		t.Fatalf("a wake hook in panic mode exited %d", code)
	}
}

func TestWakeExitsZeroForAProgramWithNoWakeAnswer(t *testing.T) {
	if code := quickWake(t, journalEnvironment("main", "s-1"), "codex", t.TempDir()); code != 0 {
		t.Fatalf("codex's wake hook exited %d", code)
	}
}
