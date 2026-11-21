package host

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// initDocker lists one running container of session-7 under the init, whose log holds the given text.
func initDocker(t *testing.T, logText string) (Containers, string) {
	t.Helper()
	folder := t.TempDir()
	log := filepath.Join(folder, "calls.log")
	script := `#!/bin/sh
echo "$*" >> ` + log + `
case "$1" in
ps) printf 'c7\tsession-7\trunning\t"/opt/journal/bin/journal-init -- claude"\n' ;;
logs) printf '` + logText + `' ;;
*) exit 0 ;;
esac
`
	path := filepath.Join(folder, "docker")
	if err := os.WriteFile(path, []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}

	return Containers{Docker: path}, log
}

func TestARunningInitThatSaidReadyIsAdopted(t *testing.T) {
	containers, log := initDocker(t, `journal-init: ready\nhello\n`)

	sessions, err := ContainerSessionsOf(context.Background(), containers, "journal")
	if err != nil {
		t.Fatal(err)
	}

	if !sessions["session-7"].Running || strings.Contains(strings.Join(calls(t, log), "\n"), "rm --force") {
		t.Fatalf("a ready init was not adopted: %+v", sessions)
	}
}

func TestAnInitTheHostRestartedDuringIsRemovedAndCountsAsExited(t *testing.T) {
	containers, log := initDocker(t, `starting\n`)

	sessions, err := ContainerSessionsOf(context.Background(), containers, "journal")
	if err != nil {
		t.Fatal(err)
	}

	if sessions["session-7"].Running || !strings.Contains(strings.Join(calls(t, log), "\n"), "rm --force c7") {
		t.Fatalf("a half-started container stayed: %+v", sessions)
	}
	if sessions.reconcileContainer(StartRecord{SessionID: "session-7"}) != Exited {
		t.Fatal("a half-started container was not reported exited")
	}
}
