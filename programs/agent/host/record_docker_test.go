package host

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/dockermock"
	"journal-agent/recording"
)

const recordedImage = "registry.example/journal-helper@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

// recordedRun is a recording run's drafts, with the run open as the journal's openRun leaves it or with no run.
func recordedRun(t *testing.T, isOpen bool) recording.Drafts {
	t.Helper()
	folder := t.TempDir()
	if !isOpen {
		return recording.Drafts{Folder: folder}
	}
	if err := os.WriteFile(filepath.Join(folder, "run.json"), []byte(`{"scenario":"x","opened_at":1,"closed_at":null}`), 0o664); err != nil {
		t.Fatal(err)
	}
	return recording.Drafts{Folder: folder}
}

// recordedCalls are the calls of the daemon's draft, each as its type, method and path, and whether it was upgraded.
func recordedCalls(t *testing.T, drafts recording.Drafts) []string {
	t.Helper()
	content, err := os.ReadFile(filepath.Join(drafts.Folder, "docker", recordedDaemonExchange+".jsonl"))
	if err != nil {
		return nil
	}
	calls := []string{}
	for _, line := range strings.Split(strings.TrimSpace(string(content)), "\n")[1:] {
		var event struct {
			Type string         `json:"type"`
			Call recording.Call `json:"call"`
		}
		if err := json.Unmarshal([]byte(line), &event); err != nil {
			t.Fatal(err)
		}
		path := event.Call.Path
		if event.Call.IsUpgraded {
			path += " upgraded"
		}
		calls = append(calls, event.Type+" "+event.Call.Method+" "+path)
	}
	return calls
}

func TestEveryCallToTheDaemonIsKeptWhileRecordingAndAnAttachOnlyAsUpgraded(t *testing.T) {
	daemon := dockermock.Start(t, recordedImage)
	drafts := recordedRun(t, true)
	containers, err := containersRecordedInto(daemon.Host(), ContainerRules{Arrangement: Local}, drafts)
	if err != nil {
		t.Fatal(err)
	}

	run := ContainerRun{DeadlineMs: 30000, Manifest: ContainerManifest{Image: recordedImage, Restart: "no"}, Command: []string{"true"}}
	if _, err := containers.RunToEnd(context.Background(), run); err != nil {
		t.Fatal(err)
	}

	calls := strings.Join(recordedCalls(t, drafts), "\n")
	for _, kept := range []string{"asked POST /v1.57/containers/create", "answered POST /v1.57/containers/create",
		"answered POST /v1.57/containers/c1/start", "answered POST /v1.57/containers/c1/wait",
		"answered DELETE /v1.57/containers/c1", "answered POST /v1.57/containers/c1/attach upgraded"} {
		if !strings.Contains(calls, kept) {
			t.Fatalf("the draft lacks %q:\n%s", kept, calls)
		}
	}
}

func TestOutsideAnOpenRunTheDaemonsCallsAreNotKept(t *testing.T) {
	daemon := dockermock.Start(t, recordedImage)
	drafts := recordedRun(t, false)
	containers, err := containersRecordedInto(daemon.Host(), ContainerRules{Arrangement: Local}, drafts)
	if err != nil {
		t.Fatal(err)
	}

	run := ContainerRun{DeadlineMs: 30000, Manifest: ContainerManifest{Image: recordedImage, Restart: "no"}, Command: []string{"true"}}
	if _, err := containers.RunToEnd(context.Background(), run); err != nil {
		t.Fatal(err)
	}

	if calls := recordedCalls(t, drafts); calls != nil {
		t.Fatalf("with no open run the draft kept %v", calls)
	}
}
