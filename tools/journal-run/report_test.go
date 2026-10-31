package main

import (
	"strings"
	"testing"
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

func TestARunTheServerDoesNotAnswerStillRunsAndKeepsItsFolder(t *testing.T) {
	client := newClient()
	client.failing = true
	setup := options(t, "echo kept")
	output, code := run(t, setup, client)
	if code != 0 || output != "kept\n" || readFile(t, folderOf(setup)+"/1.out") != "kept\n" || strings.TrimSpace(readFile(t, folderOf(setup)+"/end")) != "0" {
		t.Fatalf("printed %q with code %d", output, code)
	}
}
