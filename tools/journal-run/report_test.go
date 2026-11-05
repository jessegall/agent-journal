package main

import (
	"strings"
	"testing"
	"time"
)

func TestEachPartThatRanAndTheEndOfTheChainAreReportedThroughTheClient(t *testing.T) {
	client := newClient()
	run(t, options(t, "echo one && sh -c 'exit 2' && echo skipped"), client)
	reported := strings.Join(client.reported(), "\n")
	for _, want := range []string{"process part-end 4 --position 1 --exit-code 0", "process part-end 4 --position 2 --exit-code 2", "process end 4 --exit-code 2 --bytes 4 --lines 1"} {
		if !strings.Contains(reported, want) {
			t.Errorf("reported %q, which lacks %q", reported, want)
		}
	}
	if strings.Contains(reported, "--position 3") {
		t.Errorf("a skipped part was reported: %q", reported)
	}
}

func TestEachPartStartIsReportedBeforeItsEnd(t *testing.T) {
	client := newClient()
	run(t, options(t, "echo one && echo two"), client)
	want := []string{"process part-start 4 --position 1", "process part-end 4 --position 1 --exit-code 0", "process part-start 4 --position 2", "process part-end 4 --position 2 --exit-code 0"}
	actual := client.reported()
	if len(actual) < len(want) || strings.Join(actual[:len(want)], "\n") != strings.Join(want, "\n") {
		t.Errorf("reported %q, which does not open with %q", actual, want)
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
