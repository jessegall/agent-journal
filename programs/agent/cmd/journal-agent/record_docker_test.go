//go:build mock

package main

import (
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/recording"
)

// A Docker command line pointed at record-docker's socket reaches the daemon, and its call is kept in the run's drafts.
func TestTheInstallersDockerCallsPassThroughAndAreKept(t *testing.T) {
	folder := t.TempDir()
	daemonSocket := filepath.Join(folder, "daemon.sock")
	daemonListener, err := net.Listen("unix", daemonSocket)
	if err != nil {
		t.Fatal(err)
	}
	daemon := httptest.NewUnstartedServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
		_, _ = io.WriteString(writer, `[{"Id":"c1"}]`)
	}))
	daemon.Listener = daemonListener
	daemon.Start()
	t.Cleanup(daemon.Close)
	drafts := recording.Drafts{Folder: filepath.Join(folder, "drafts")}
	if err := os.MkdirAll(drafts.Folder, 0o775); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(drafts.Folder, "run.json"), []byte(`{"closed_at":null}`), 0o664); err != nil {
		t.Fatal(err)
	}
	tap := httptest.NewServer(dockerTap(daemonSocket, drafts))
	t.Cleanup(tap.Close)

	answer, err := http.Get(tap.URL + "/v1.47/containers/json")
	if err != nil {
		t.Fatal(err)
	}
	body, _ := io.ReadAll(answer.Body)
	_ = answer.Body.Close()

	draft, _ := os.ReadFile(filepath.Join(drafts.Folder, "docker", recordedInstallerExchange+".jsonl"))
	if string(body) != `[{"Id":"c1"}]` || strings.Count(string(draft), "/v1.47/containers/json") != 2 {
		t.Fatalf("the command line got %q and the draft holds:\n%s", body, draft)
	}
}
