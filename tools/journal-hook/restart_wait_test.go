package main

import (
	"bytes"
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// restartingProject is a project whose server left its restart mark, with the waits short.
func restartingProject(t *testing.T) (root, mark string) {
	t.Helper()
	window, pause := RestartWindow, RetryPause
	RestartWindow, RetryPause = 100*time.Millisecond, 2*time.Millisecond
	t.Cleanup(func() { RestartWindow, RetryPause = window, pause })
	root = project(t, "8431")
	mark = filepath.Join(root, ".journal", restartMarkName)
	writeFile(t, mark, "700")
	return root, mark
}

func bypassNoted(root string) bool {
	_, err := os.Stat(filepath.Join(root, ".journal", "runtime", "bypass.log"))
	return err == nil
}

func TestAHookWaitsWhileTheServerRestartsAndIsAnsweredWhenItIsBack(t *testing.T) {
	root, mark := restartingProject(t)
	asks := 0
	status, answered := post(sample(root, "pre_tool_use"), fakeTransport(func(request *http.Request) (*http.Response, error) {
		asks++
		if asks == 1 {
			return answer(http.StatusConflict, `{"error":"newer code"}`)(request)
		}
		if asks < 4 {
			return nil, errors.New("connection refused")
		}
		os.Remove(mark)
		return answer(http.StatusOK, `{"lines":[]}`)(request)
	}), time.Unix(1793395000, 0))
	if status != http.StatusOK || string(answered) != `{"lines":[]}` || asks != 4 {
		t.Fatalf("status %d answer %s after %d asks", status, answered, asks)
	}
	if bypassNoted(root) {
		t.Fatal("a hook that waited and was answered is noted as gone around the journal")
	}
}

func TestAHookStartsTheServerWhenItsSocketGoesAfterTheFirstAsk(t *testing.T) {
	root, mark := restartingProject(t)
	RestartWindow = 10 * time.Second
	home := filepath.Join(root, ".journal")
	started := filepath.Join(home, "started")
	socket := filepath.Join(home, "server.sock")
	writeFile(t, socket, "")
	writeFile(t, filepath.Join(home, "bin", "journal"), "#!/bin/sh\ntouch "+started+"\n")
	if err := os.Chmod(filepath.Join(home, "bin", "journal"), 0o755); err != nil {
		t.Fatal(err)
	}
	asks := 0
	post(sample(root, "pre_tool_use"), fakeTransport(func(request *http.Request) (*http.Response, error) {
		asks++
		if asks == 3 {
			os.Remove(socket)
		}
		if _, err := os.Stat(started); err == nil {
			os.Remove(mark)
			return answer(http.StatusOK, `{"lines":[]}`)(request)
		}
		return nil, errors.New("connection refused")
	}), time.Unix(1793395000, 0))
	if _, err := os.Stat(started); err != nil {
		t.Fatalf("the server was not started after %d asks", asks)
	}
}

func TestAHookStartsNoClientWhileAServerBoots(t *testing.T) {
	root, _ := restartingProject(t)
	home := filepath.Join(root, ".journal")
	starts := filepath.Join(home, "starts")
	writeFile(t, filepath.Join(home, serverStartMarkName), "")
	writeFile(t, filepath.Join(home, "bin", "journal"), "#!/bin/sh\necho start >> "+starts+"\n")
	if err := os.Chmod(filepath.Join(home, "bin", "journal"), 0o755); err != nil {
		t.Fatal(err)
	}
	post(sample(root, "pre_tool_use"), unreachable, time.Unix(1793395000, 0))
	time.Sleep(300 * time.Millisecond)
	if _, err := os.Stat(starts); err == nil {
		t.Fatal("a client was started while a server boots")
	}
}

func TestAHookIsAnsweredAtOnceWhenTheServerIsBackAndAMarkWasLeft(t *testing.T) {
	root, _ := restartingProject(t)
	status, _ := post(sample(root, "pre_tool_use"), answer(http.StatusOK, `{"lines":[]}`), time.Unix(1793395000, 0))
	if status != http.StatusOK {
		t.Fatalf("status %d", status)
	}
}

func TestAToolIsRefusedWhenTheServerDoesNotComeBackInTheWindow(t *testing.T) {
	root, _ := restartingProject(t)
	status, _ := post(sample(root, "pre_tool_use"), unreachable, time.Unix(1793395000, 0))
	if status != restartTimedOut {
		t.Fatalf("status %d", status)
	}
	if bypassNoted(root) {
		t.Fatal("a refused tool is noted as gone around the journal")
	}
	program := programs.Program{Refusals: map[string]string{"pre_tool_use": "deny"}}
	var stdout, stderr bytes.Buffer
	Answered(&stdout, &stderr, program, "PreToolUse", "pre_tool_use", status, nil, root, time.Second)
	if !strings.Contains(stdout.String(), `"permissionDecision":"deny"`) || !strings.Contains(stdout.String(), "did not come back") {
		t.Fatalf("answered %s", stdout.String())
	}
}

func TestAMarkOlderThanItsLimitCountsAsNone(t *testing.T) {
	root, mark := restartingProject(t)
	old := time.Now().Add(-RestartMarkLimit - time.Second)
	if err := os.Chtimes(mark, old, old); err != nil {
		t.Fatal(err)
	}
	began := time.Now()
	status, _ := post(sample(root, "pre_tool_use"), unreachable, time.Unix(1793395000, 0))
	if status == restartTimedOut || time.Since(began) >= RestartWindow {
		t.Fatalf("status %d after %s", status, time.Since(began))
	}
	if !bypassNoted(root) {
		t.Fatal("a hook that goes on without the journal is noted")
	}
}

func TestAnEventOtherThanAToolGoesOnWithALineWhenTheServerDoesNotComeBack(t *testing.T) {
	reply := restartTimedOutReply("prompt")
	if reply.Refusal != "" || !strings.Contains(strings.Join(reply.Lines, ""), "went through unchecked") {
		t.Fatalf("reply %+v", reply)
	}
}
