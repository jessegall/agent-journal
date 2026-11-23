package host

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// runningDocker lists one running container of session-7 and ends a removal with the given exit code.
func runningDocker(t *testing.T, removalExit string) (Containers, string) {
	t.Helper()
	folder := t.TempDir()
	log := filepath.Join(folder, "calls.log")
	script := `#!/bin/sh
echo "$*" >> ` + log + `
case "$1" in
ps) printf 'c7\tsession-7\trunning\n' ;;
rm) exit ` + removalExit + ` ;;
*) exit 0 ;;
esac
`
	path := filepath.Join(folder, "docker")
	if err := os.WriteFile(path, []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}

	return Containers{Docker: path}, log
}

// User message 19586: a session whose host restarted is no longer served, so it is stopped by itself and marked so.
func TestASessionContainerFoundRunningWhenTheHostStartsIsRemovedAndCountsAsExited(t *testing.T) {
	containers, log := runningDocker(t, "0")

	sessions, err := ContainerSessionsOf(context.Background(), containers, "journal")
	if err != nil {
		t.Fatal(err)
	}

	if sessions["session-7"].Running || !strings.Contains(strings.Join(calls(t, log), "\n"), "rm --force c7") {
		t.Fatalf("a container nothing serves stayed: %+v", sessions)
	}
	if sessions.reconcileContainer(StartRecord{SessionID: "session-7"}) != Exited {
		t.Fatal("a removed container was not reported exited")
	}
}

func TestASessionContainerThatCouldNotBeRemovedNeedsAttention(t *testing.T) {
	containers, _ := runningDocker(t, "1")

	sessions, err := ContainerSessionsOf(context.Background(), containers, "journal")
	if err != nil {
		t.Fatal(err)
	}

	if sessions.reconcileContainer(StartRecord{SessionID: "session-7"}) != NeedsAttention {
		t.Fatalf("a container that still runs was reported as %+v", sessions)
	}
}
