package main

import (
	"bytes"
	"strings"
	"testing"
	"time"
)

func TestAFinishedOutputIsToldAtOnceWithoutWaiting(t *testing.T) {
	slept := 0
	var printed bytes.Buffer
	ask := func(line ...string) (string, int) {
		if line[1] == "status" {
			return "output 7 finished with exit code 0\n", SuccessCode
		}
		return "12 passed\n", SuccessCode
	}
	code := WatchOutput("7", ask, func(time.Duration) { slept++ }, &printed)
	if code != SuccessCode || slept != 0 || printed.String() != "12 passed\n" {
		t.Fatalf("code %d, slept %d, printed %q", code, slept, printed.String())
	}
}

func TestARunningOutputIsWaitedForAndToldOnceItEnds(t *testing.T) {
	asked := 0
	var printed bytes.Buffer
	ask := func(line ...string) (string, int) {
		if line[1] == "read" {
			return "1 failed\n", SuccessCode
		}
		asked++
		if asked < 3 {
			return "output 7 is running: 3 lines\n", SuccessCode
		}
		return "output 7 failed with exit code 1\n", SuccessCode
	}
	slept := 0
	if code := WatchOutput("7", ask, func(time.Duration) { slept++ }, &printed); code != SuccessCode {
		t.Fatalf("code %d", code)
	}
	if slept != 2 || printed.String() != "1 failed\n" {
		t.Fatalf("slept %d, printed %q", slept, printed.String())
	}
}

func TestAnOutputThatNeverEndsGivesUpAndAnUnknownOneSaysSo(t *testing.T) {
	var printed bytes.Buffer
	running := func(line ...string) (string, int) { return "output 7 is running\n", SuccessCode }
	if code := WatchOutput("7", running, func(time.Duration) {}, &printed); code != ErrorCode || !strings.Contains(printed.String(), "still running") {
		t.Fatalf("code %d, printed %q", code, printed.String())
	}
	printed.Reset()
	unknown := func(line ...string) (string, int) { return "no output 9\n", ErrorCode }
	if code := WatchOutput("9", unknown, func(time.Duration) {}, &printed); code != ErrorCode || printed.String() != "no output 9\n" {
		t.Fatalf("code %d, printed %q", code, printed.String())
	}
}
