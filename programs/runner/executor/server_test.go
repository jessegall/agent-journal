package executor

import (
	"bytes"
	"context"
	"net"
	"path/filepath"
	"testing"
)

// The commands a test sends each run, enough for a lost last output to show in a run that loses it at all.
const outputRuns = 200

// TestEveryRunDeliversItsOutputBeforeItsExit runs a command that prints and exits at once, again and again: its
// output must arrive before its exit every time, as a command's output was lost when the pipes closed at its exit.
func TestEveryRunDeliversItsOutputBeforeItsExit(t *testing.T) {
	socket := filepath.Join(t.TempDir(), "exec.sock")
	listener, err := net.ListenUnix("unix", &net.UnixAddr{Name: socket, Net: "unix"})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = listener.Close() })
	server := Server{AllowedUID: 10001, Workspace: t.TempDir(), Shell: "/bin/sh", Home: t.TempDir(),
		peerUID: func(*net.UnixConn) (int, error) { return 10001, nil }}
	go func() { _ = server.Serve(listener) }()

	for run := range outputRuns {
		client, err := Dial(context.Background(), socket)
		if err != nil {
			t.Fatal(err)
		}
		var output bytes.Buffer
		exit, err := client.Run(context.Background(), Request{Command: "printf 10002", Cwd: server.Workspace},
			Streams{Stdout: &output, Stderr: &bytes.Buffer{}})
		if err != nil || exit.Code != 0 {
			t.Fatalf("run %d ended %+v, %v", run, exit, err)
		}
		if output.String() != "10002" {
			t.Fatalf("run %d delivered %q before its exit, not its output", run, output.String())
		}
	}
}
