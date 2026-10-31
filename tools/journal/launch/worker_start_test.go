package launch

import (
	"encoding/json"
	"net"
	"os"
	"path/filepath"
	"testing"
	"time"
)

// fakeStarter keeps the programs the launcher was asked to start.
type fakeStarter struct {
	started chan ProgramStart
}

func (starter fakeStarter) Start(start ProgramStart) error {
	starter.started <- start
	return nil
}

func TestAWorkerRequestOnTheLaunchersSocketStartsItsProgramInTheWorktreeWithTheWorkersIdentity(t *testing.T) {
	folder, err := os.MkdirTemp("/tmp", "launch")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	socket := filepath.Join(folder, "launcher.sock")
	starter := fakeStarter{started: make(chan ProgramStart, 1)}
	listener, err := Listen(socket, starter)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	connection, err := net.Dial("unix", socket)
	if err != nil {
		t.Fatal(err)
	}
	request := WorkerRequest{AgentID: 16, Session: "u-1", Environment: "main", Folder: "/work/shop/.journal/worktrees/main/worker-16", Command: []string{"claude", "--session-id", "u-1"}}
	if err := json.NewEncoder(connection).Encode(request); err != nil {
		t.Fatal(err)
	}
	connection.Close()
	select {
	case start := <-starter.started:
		if start.Folder != request.Folder || start.Command[0] != "claude" || start.Variables["JOURNAL_AGENT_ID"] != "16" || start.Variables["JOURNAL_ENV"] != "main" {
			t.Fatalf("the worker started as %+v", start)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("no program was started for the worker")
	}
}
