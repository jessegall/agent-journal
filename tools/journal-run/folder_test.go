package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestTheFolderHoldsTheLineThePartsThePidTheStatusesTheOutputsAndTheEnd(t *testing.T) {
	setup := options(t, "echo one && echo two")
	run(t, setup, newClient())
	folder := folderOf(setup)
	if readFile(t, folder+"/line") != "echo one && echo two" || readFile(t, folder+"/parts") != "echo one\necho two" {
		t.Errorf("the line is %q and the parts %q", readFile(t, folder+"/line"), readFile(t, folder+"/parts"))
	}
	if readFile(t, folder+"/1.out") != "one\n" || readFile(t, folder+"/2.out") != "two\n" {
		t.Errorf("the outputs are %q and %q", readFile(t, folder+"/1.out"), readFile(t, folder+"/2.out"))
	}
	for _, name := range []string{"1.status", "2.status", "end"} {
		if strings.TrimSpace(readFile(t, folder+"/"+name)) != "0" {
			t.Errorf("%s holds %q", name, readFile(t, folder+"/"+name))
		}
	}
	if !exists(folder + "/pid") {
		t.Error("the run left no pid")
	}
}

func TestAFailedPartKeepsItsExitCodeAndTheEndTheChainsLast(t *testing.T) {
	setup := options(t, "sh -c 'exit 3'")
	_, code := run(t, setup, newClient())
	if code != 3 || strings.TrimSpace(readFile(t, folderOf(setup)+"/1.status")) != "3" || strings.TrimSpace(readFile(t, folderOf(setup)+"/end")) != "3" {
		t.Fatalf("code %d, status %q, end %q", code, readFile(t, folderOf(setup)+"/1.status"), readFile(t, folderOf(setup)+"/end"))
	}
}

func TestTheHeartbeatIsWrittenWhileTheShellLives(t *testing.T) {
	setup := options(t, "sleep 1")
	setup.HeartbeatEvery = 50 * time.Millisecond
	finished := make(chan struct{})
	go func() {
		run(t, setup, newClient())
		close(finished)
	}()
	waitFor(t, 5*time.Second, "the heartbeat", func() bool { return exists(folderOf(setup) + "/heartbeat") })
	first := modified(t, folderOf(setup)+"/heartbeat")
	waitFor(t, 5*time.Second, "a later heartbeat", func() bool { return modified(t, folderOf(setup)+"/heartbeat").After(first) })
	<-finished
}

// The files a run leaves are the format support/output_folder.py reads; tests/unit/core/modules/processes reads the same
// example, so the two sides cannot drift apart.
func TestTheFilesOfARunAreTheSharedExampleOfTheFormat(t *testing.T) {
	setup := options(t, "echo one && echo two")
	run(t, setup, newClient())
	for _, name := range []string{"line", "parts", "1.out", "2.out", "1.status", "2.status", "end"} {
		want, err := os.ReadFile(filepath.Join("testdata", "home", "processes", "4", name))
		if err != nil || readFile(t, folderOf(setup)+"/"+name) != string(want) {
			t.Errorf("%s holds %q, the example %q", name, readFile(t, folderOf(setup)+"/"+name), want)
		}
	}
}
