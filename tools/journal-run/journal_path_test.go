package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunnerUsesItsInstalledJournalWhenTheGlobalDispatcherIsOld(t *testing.T) {
	for _, reachable := range []bool{true, false} {
		name := "without server"
		if reachable {
			name = "with server"
		}
		t.Run(name, func(t *testing.T) {
			setup := options(t, "journal overview")
			writeJournal(t, filepath.Join(setup.Home, "bin"), "printf '%s\\n' installed \"$JOURNAL_HOME\" \"$PWD\"")
			global := t.TempDir()
			writeJournal(t, global, "echo 'no .journal/ here or above'; exit 1")
			t.Setenv("PATH", global+string(os.PathListSeparator)+os.Getenv("PATH"))
			working := t.TempDir()
			t.Chdir(working)
			client := newClient()
			client.reachable = reachable
			output, code := run(t, setup, client)
			if code != 0 || !strings.Contains(output, "installed\n"+setup.Home+"\n") || !strings.Contains(output, working) {
				t.Fatalf("printed %q with code %d", output, code)
			}
		})
	}
}

func TestJournalClientReportsThroughItsInstalledJournal(t *testing.T) {
	home := filepath.Join(t.TempDir(), ".journal")
	record := filepath.Join(t.TempDir(), "reported")
	writeJournal(t, filepath.Join(home, "bin"), "printf '%s\\n' \"$JOURNAL_HOME\" \"$@\" > "+quoted(record))
	global := t.TempDir()
	writeJournal(t, global, "exit 1")
	t.Setenv("PATH", global+string(os.PathListSeparator)+os.Getenv("PATH"))
	if err := (JournalClient{Home: home}).Run("process", "end", "7"); err != nil {
		t.Fatal(err)
	}
	if actual := readFile(t, record); actual != home+"\nprocess\nend\n7\n" {
		t.Fatalf("reported %q", actual)
	}
}

func writeJournal(t *testing.T, bin, body string) {
	t.Helper()
	if err := os.MkdirAll(bin, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(bin, "journal"), []byte("#!/bin/sh\n"+body+"\n"), 0o755); err != nil {
		t.Fatal(err)
	}
}
