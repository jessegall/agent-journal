package main

import (
	"io"
	"os"
	"strings"
	"testing"
	"time"
)

func TestThePartsThatEndWithTheLineAreToldOnlyByItsEnd(t *testing.T) {
	setup := options(t, "echo one && echo two")
	folder := NewFolder(setup.Home, setup.Process)
	if err := folder.Start(setup.Line, Parts(setup.Line), "true"); err != nil {
		t.Fatal(err)
	}
	for _, name := range []string{"1.started", "1.status", "2.started", "2.status"} {
		if err := os.WriteFile(folderOf(setup)+"/"+name, []byte("0"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	client := newClient()
	tracker := Tracker{Options: setup, Client: client, Folder: folder, Parts: 2, Reported: map[int]bool{}}
	tracker.finish(io.Discard, 0)
	if reported := client.reported(); len(reported) != 1 || !strings.HasPrefix(reported[0], "process end 4 --exit-code 0") {
		t.Errorf("reported %q, not the end alone", reported)
	}
}

func TestAPartThatStillRunsIsReportedStartedWhileItRuns(t *testing.T) {
	client := newClient()
	setup := options(t, "echo one && sleep 5")
	go func() {
		var output strings.Builder
		Run(setup, client, &output)
	}()
	waitFor(t, 5*time.Second, "the start of the second part", func() bool {
		return strings.Contains(strings.Join(client.reported(), "\n"), "process part-start 4 --position 2")
	})
	if strings.Contains(strings.Join(client.reported(), "\n"), "process part-end 4 --position 2") {
		t.Errorf("the part that still runs was reported ended: %q", client.reported())
	}
}

func TestARunTheServerDoesNotAnswerStillRunsAndKeepsItsFolder(t *testing.T) {
	client := newClient()
	client.failing = true
	setup := options(t, "echo kept")
	output, code := run(t, setup, client)
	if code != 0 || output != "kept\n" || readFile(t, folderOf(setup)+"/1.out") != "kept\n" || strings.TrimSpace(readFile(t, folderOf(setup)+"/end")) != "0" {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestALineThatMayWriteStartsAFileScanOnceItHasEndedAndAPlainReadStartsNone(t *testing.T) {
	scans := 0
	setup := options(t, "echo one")
	setup.ScanFiles = func(Options) { scans++ }
	var output strings.Builder
	Run(setup, newClient(), &output)
	if scans != 1 {
		t.Fatalf("a line that may write starts one scan, it started %d", scans)
	}
	plainRead := options(t, "echo one")
	plainRead.OnlyReads = true
	plainRead.ScanFiles = func(Options) { scans++ }
	Run(plainRead, newClient(), &output)
	if scans != 1 {
		t.Fatalf("a plain read starts no scan, it started %d", scans-1)
	}
}
