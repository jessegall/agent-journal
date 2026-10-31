package main

import (
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"
)

// recordingClient stands in for the journal client: it records every line the runner reports.
type recordingClient struct {
	mutex     sync.Mutex
	reachable bool
	failing   bool
	lines     []string
}

func newClient() *recordingClient { return &recordingClient{reachable: true} }

func (client *recordingClient) Reachable() bool { return client.reachable }

func (client *recordingClient) Run(arguments ...string) error {
	client.mutex.Lock()
	defer client.mutex.Unlock()
	client.lines = append(client.lines, strings.Join(arguments, " "))
	if client.failing {
		return os.ErrDeadlineExceeded
	}
	return nil
}

func (client *recordingClient) reported() []string {
	client.mutex.Lock()
	defer client.mutex.Unlock()
	return append([]string(nil), client.lines...)
}

// bounded fails a test that takes longer than the limit, so no test of the runner can hang the run.
func bounded(t *testing.T, limit time.Duration, body func()) {
	t.Helper()
	finished := make(chan struct{})
	go func() {
		defer close(finished)
		body()
	}()
	select {
	case <-finished:
	case <-time.After(limit):
		t.Fatalf("the test did not finish within %s", limit)
	}
}

func options(t *testing.T, line string) Options {
	t.Helper()
	return Options{Process: 4, LimitSeconds: 30, Line: line, Home: filepath.Join(t.TempDir(), ".journal"), Shell: "/bin/sh", HeartbeatEvery: time.Hour}
}

func folderOf(options Options) string {
	return filepath.Join(options.Home, "processes", "4")
}

func readFile(t *testing.T, path string) string {
	t.Helper()
	text, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("%s does not read: %v", path, err)
	}
	return string(text)
}

func exists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func waitFor(t *testing.T, limit time.Duration, subject string, ready func() bool) {
	t.Helper()
	deadline := time.Now().Add(limit)
	for !ready() {
		if time.Now().After(deadline) {
			t.Fatalf("%s did not happen within %s", subject, limit)
		}
		time.Sleep(10 * time.Millisecond)
	}
}

func run(t *testing.T, options Options, client Client) (string, int) {
	t.Helper()
	var output strings.Builder
	var code int
	bounded(t, 20*time.Second, func() { code = Run(options, client, &output) })
	return output.String(), code
}
