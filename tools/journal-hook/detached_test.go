//go:build !windows

package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// TestMain lets the test binary stand in for journal-hook when an async hook starts it as --detached-run.
func TestMain(m *testing.M) {
	if len(os.Args) == 6 && os.Args[1] == "--detached-run" {
		os.Exit(detachedRun(os.Args[2], os.Args[3], os.Args[4], os.Args[5]))
	}
	os.Exit(m.Run())
}

// asyncProject is a project with one async claude project hook that runs command under the timeout.
func asyncProject(t *testing.T, command string, timeout int) (string, ManagedHook) {
	t.Helper()
	root := t.TempDir()
	hook := ManagedHook{ID: "async", Program: "claude", Event: "PostToolUse", Command: command, Timeout: timeout, State: "on", Fields: map[string]any{"async": true}}
	text := fmt.Sprintf(`{"version":1,"hooks":[{"id":"async","program":"claude","event":"PostToolUse","command":%q,"timeout":%d,"state":"on","fields":{"async":true}}]}`, command, timeout)
	writeFile(t, filepath.Join(root, ".journal", "hooks", "managed.json"), text)
	return root, hook
}

func appeared(path string, within time.Duration) bool {
	for ended := time.Now().Add(within); time.Now().Before(ended); time.Sleep(50 * time.Millisecond) {
		if _, err := os.Stat(path); err == nil {
			return true
		}
	}
	return false
}

func TestAnAsyncHookIsStartedAndNotWaitedFor(t *testing.T) {
	marker := filepath.Join(t.TempDir(), "done")
	root, hook := asyncProject(t, "sleep 2; touch '"+marker+"'", 10)
	started := time.Now()
	runManaged([]ManagedHook{hook}, []byte(`{}`), "claude", programs.LoadTable("").Programs["claude"], root)
	if time.Since(started) > time.Second || !appeared(marker, 6*time.Second) {
		t.Fatalf("the async hook was waited for or never ran (%s)", time.Since(started))
	}
}

func TestAnAsyncHookKeepsRunningAfterTheHookProgramReturns(t *testing.T) {
	marker := filepath.Join(t.TempDir(), "later")
	root, hook := asyncProject(t, "sleep 1; cat > '"+marker+"'", 10)
	runManaged([]ManagedHook{hook}, []byte(`{"hook_event_name":"PostToolUse"}`), "claude", programs.LoadTable("").Programs["claude"], root)
	if !appeared(marker, 6*time.Second) {
		t.Fatal("the async hook did not run on after runManaged returned")
	}
	time.Sleep(200 * time.Millisecond)
	if text, _ := os.ReadFile(marker); string(text) != `{"hook_event_name":"PostToolUse"}` {
		t.Fatalf("the async hook read %q on stdin", text)
	}
}

func TestAnAsyncHooksOutputIsDropped(t *testing.T) {
	root, hook := asyncProject(t, "printf lost", 10)
	runs := runManaged([]ManagedHook{hook, {ID: "waited", Command: "printf kept", Timeout: 5}}, nil, "claude", programs.LoadTable("").Programs["claude"], root)
	if len(runs) != 1 || runs[0].Stdout != "kept" {
		t.Fatalf("the replies hold %+v", runs)
	}
}

func TestAnAsyncHookStopsAtItsTimeout(t *testing.T) {
	marker := filepath.Join(t.TempDir(), "never")
	root, hook := asyncProject(t, "sleep 3; touch '"+marker+"'", 1)
	runManaged([]ManagedHook{hook}, nil, "claude", programs.LoadTable("").Programs["claude"], root)
	if appeared(marker, 5*time.Second) {
		t.Fatal("the async hook ran past its timeout")
	}
}

func TestAnAsyncHookReturnsNoRunForTheServer(t *testing.T) {
	root, hook := asyncProject(t, "true", 10)
	if runs := runManaged([]ManagedHook{hook}, nil, "claude", programs.LoadTable("").Programs["claude"], root); len(runs) != 0 {
		t.Fatalf("an async hook gave the server %+v", runs)
	}
}

// rewakeProject is a project with one asyncRewake hook of the program that runs command, and the body file of its run.
func rewakeProject(t *testing.T, program, command string) (string, string) {
	t.Helper()
	root := t.TempDir()
	text := fmt.Sprintf(`{"version":1,"hooks":[{"id":"watch","program":%q,"event":"PostToolUse","command":%q,"timeout":5,"state":"on","fields":{"asyncRewake":true}}]}`, program, command)
	writeFile(t, filepath.Join(root, ".journal", "hooks", "managed.json"), text)
	bodyFile := filepath.Join(t.TempDir(), "body")
	writeFile(t, bodyFile, `{"session_id":"s-1"}`)
	return root, bodyFile
}

// keptWakeLines puts a server in place of the journal's that keeps every wake line posted to it.
func keptWakeLines(t *testing.T, transport http.RoundTripper) *[]map[string]string {
	t.Helper()
	posted := &[]map[string]string{}
	original := wakeLineTransport
	wakeLineTransport = func(string) http.RoundTripper {
		if transport != nil {
			return transport
		}
		return fakeTransport(func(request *http.Request) (*http.Response, error) {
			var fields map[string]string
			json.NewDecoder(request.Body).Decode(&fields)
			*posted = append(*posted, fields)
			return answer(http.StatusOK, "{}")(request)
		})
	}
	t.Cleanup(func() { wakeLineTransport = original })
	return posted
}

func TestAsyncRewakeExitTwoPostsItsStderr(t *testing.T) {
	posted := keptWakeLines(t, nil)
	root, bodyFile := rewakeProject(t, "claude", "printf 'the build broke' >&2; exit 2")
	detachedRun("claude", root, "watch", bodyFile)
	if len(*posted) != 1 || (*posted)[0]["text"] != "the build broke" || (*posted)[0]["hook"] != "watch" || (*posted)[0]["session"] != "s-1" {
		t.Fatalf("the wake lines posted are %+v", *posted)
	}
}

func TestAsyncRewakeOtherExitCodesPostNothing(t *testing.T) {
	posted := keptWakeLines(t, nil)
	for _, command := range []string{"printf fine >&2; exit 0", "printf broke >&2; exit 1"} {
		root, bodyFile := rewakeProject(t, "claude", command)
		detachedRun("claude", root, "watch", bodyFile)
	}
	if len(*posted) != 0 {
		t.Fatalf("a hook that did not exit 2 posted %+v", *posted)
	}
}

func TestAsyncRewakeWithNoServerDropsTheLine(t *testing.T) {
	keptWakeLines(t, unreachable)
	root, bodyFile := rewakeProject(t, "claude", "printf broke >&2; exit 2")
	if code := detachedRun("claude", root, "watch", bodyFile); code != 0 {
		t.Fatalf("the detached run with no server exited %d", code)
	}
}

func TestAsyncRewakeIsIgnoredForAProgramThatDoesNotHonourIt(t *testing.T) {
	posted := keptWakeLines(t, nil)
	root, bodyFile := rewakeProject(t, "codex", "printf broke >&2; exit 2")
	detachedRun("codex", root, "watch", bodyFile)
	if len(*posted) != 0 || isAsync(ManagedHook{Fields: map[string]any{"asyncRewake": true}}, programs.LoadTable("").Programs["codex"]) {
		t.Fatalf("codex honoured asyncRewake: %+v", *posted)
	}
}

func TestOnFailureIsIgnoredForAnAsyncHook(t *testing.T) {
	root, hook := asyncProject(t, "exit 1", 10)
	hook.Fields["onFailure"] = "block"
	if runs := runManaged([]ManagedHook{hook}, nil, "claude", programs.LoadTable("").Programs["claude"], root); len(runs) != 0 {
		t.Fatalf("an async hook gave a run that could refuse: %+v", runs)
	}
}
