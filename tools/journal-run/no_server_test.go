package main

import (
	"strings"
	"testing"
)

func TestWithNoServerTheLineRunsAsItIsAndLeavesNoFolder(t *testing.T) {
	client := newClient()
	client.reachable = false
	setup := options(t, "echo plain && sh -c 'exit 5'")
	output, code := run(t, setup, client)
	if output != "plain\n" || code != 5 || exists(folderOf(setup)) || len(client.reported()) != 0 {
		t.Fatalf("printed %q with code %d, reported %q", output, code, client.reported())
	}
}

func TestWithNoServerTheBypassIsNotedInTheRuntimeLog(t *testing.T) {
	client := newClient()
	client.reachable = false
	setup := options(t, "echo plain")
	run(t, setup, client)
	logged := readFile(t, setup.Home+"/runtime/bypass.log")
	if !strings.Contains(logged, "process 4") || !strings.Contains(logged, "echo plain") {
		t.Fatalf("the bypass log holds %q", logged)
	}
}
