package main

import (
	"bytes"
	"strings"
	"testing"
	"time"
)

func TestAFinishedOutputIsToldAtOnceWithoutWaiting(t *testing.T) {
	slept := 0
	var output bytes.Buffer
	query := func(line ...string) (string, int) {
		if line[1] == "status" {
			return "7  finished\n", SuccessCode
		}
		return "12 passed\n", SuccessCode
	}
	code := WatchOutput("7", query, func(time.Duration) { slept++ }, &output)
	if code != SuccessCode || slept != 0 || output.String() != "12 passed\n" {
		t.Fatalf("code %d, slept %d, printed %q", code, slept, output.String())
	}
}

func TestARunningOutputIsWaitedForAndToldOnceItEnds(t *testing.T) {
	requestCount := 0
	var output bytes.Buffer
	query := func(line ...string) (string, int) {
		if line[1] == "read" {
			return "1 failed\n", SuccessCode
		}
		requestCount++
		if requestCount < 3 {
			return "7  running\n", SuccessCode
		}
		return "7  failed with code 1\n", SuccessCode
	}
	slept := 0
	if code := WatchOutput("7", query, func(time.Duration) { slept++ }, &output); code != SuccessCode {
		t.Fatalf("code %d", code)
	}
	if slept != 2 || output.String() != "1 failed\n" {
		t.Fatalf("slept %d, printed %q", slept, output.String())
	}
}

func TestARestartDuringTheWaitDoesNotEndIt(t *testing.T) {
	answers := []struct {
		text string
		code int
	}{{"7  running\n", SuccessCode}, {"the journal's modules changed\n", ErrorCode}, {"7  finished\n", SuccessCode}}
	requestCount := 0
	var output bytes.Buffer
	query := func(line ...string) (string, int) {
		if line[1] == "read" {
			return "12 passed\n", SuccessCode
		}
		requestCount++
		return answers[requestCount-1].text, answers[requestCount-1].code
	}
	if code := WatchOutput("7", query, func(time.Duration) {}, &output); code != SuccessCode || output.String() != "12 passed\n" {
		t.Fatalf("code %d, printed %q", code, output.String())
	}
}

func TestAnOutputThatNeverEndsGivesUpAndAnUnknownOneSaysSo(t *testing.T) {
	var output bytes.Buffer
	running := func(line ...string) (string, int) { return "7  running\n", SuccessCode }
	if code := WatchOutput("7", running, func(time.Duration) {}, &output); code != ErrorCode || !strings.Contains(output.String(), "still running") {
		t.Fatalf("code %d, printed %q", code, output.String())
	}
	output.Reset()
	unknown := func(line ...string) (string, int) { return "no output 9\n", ErrorCode }
	if code := WatchOutput("9", unknown, func(time.Duration) {}, &output); code != ErrorCode || output.String() != "no output 9\n" {
		t.Fatalf("code %d, printed %q", code, output.String())
	}
}

func TestAnOutputThatIsDeletedEndsTheWaitAfterTwoMinutes(t *testing.T) {
	requestCount := 0
	var output bytes.Buffer
	query := func(line ...string) (string, int) {
		requestCount++
		if requestCount == 1 {
			return "7  running\n", SuccessCode
		}
		return "no output 7\n", ErrorCode
	}
	if code := WatchOutput("7", query, func(time.Duration) {}, &output); code != ErrorCode || requestCount != outputMonitorMisses+1 || output.String() != "no output 7\n" {
		t.Fatalf("code %d, asked %d, printed %q", code, requestCount, output.String())
	}
}
