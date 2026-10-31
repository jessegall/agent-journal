package main

import (
	"strconv"
	"strings"
	"syscall"
	"testing"
	"time"
)

func TestAnAndPartAfterAFailureIsSkipped(t *testing.T) {
	output, code := run(t, options(t, "false && echo skipped"), newClient())
	if strings.Contains(output, "skipped") || code != 1 {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestAPartAfterASemicolonRunsWhateverCameBefore(t *testing.T) {
	output, code := run(t, options(t, "false; echo ran"), newClient())
	if !strings.Contains(output, "ran") || code != 0 {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestSetEStopsTheChainAtTheFirstFailure(t *testing.T) {
	output, code := run(t, options(t, "set -e; false; echo skipped"), newClient())
	if strings.Contains(output, "skipped") || code != 1 {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestExecEndsTheChain(t *testing.T) {
	output, _ := run(t, options(t, "exec echo replaced; echo skipped"), newClient())
	if !strings.Contains(output, "replaced") || strings.Contains(output, "skipped") {
		t.Fatalf("printed %q", output)
	}
}

func TestAPipeIsOnePartWhoseOutputIsTheLastCommands(t *testing.T) {
	setup := options(t, "printf 'a\\nb\\n' | wc -l")
	output, code := run(t, setup, newClient())
	if code != 0 || strings.TrimSpace(output) != "2" || !exists(folderOf(setup)+"/1.out") || exists(folderOf(setup)+"/2.out") {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestAStopKillsTheWholeProcessGroup(t *testing.T) {
	setup := options(t, "sleep 60 | sleep 60")
	finished := make(chan int, 1)
	go func() {
		var output strings.Builder
		finished <- Run(setup, newClient(), &output)
	}()
	waitFor(t, 5*time.Second, "the pid file", func() bool { return exists(folderOf(setup) + "/pid") })
	pid, err := strconv.Atoi(strings.TrimSpace(readFile(t, folderOf(setup)+"/pid")))
	if err != nil {
		t.Fatalf("the pid does not read: %v", err)
	}
	if err := syscall.Kill(-pid, syscall.SIGTERM); err != nil {
		t.Fatalf("the group of %d does not take the signal: %v", pid, err)
	}
	select {
	case code := <-finished:
		if code == 0 {
			t.Errorf("a stopped run ended with code 0")
		}
	case <-time.After(10 * time.Second):
		t.Fatal("the run did not end after its group was stopped")
	}
}
