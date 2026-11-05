package main

import (
	"bytes"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
)

const (
	outputMonitorPause  = 5 * time.Second
	outputMonitorMost   = 2 * time.Hour
	outputRunningWord   = "  running"
	outputMonitorMisses = 60
)

// OutputMonitor is `journal output monitor <n>`, the command to hand the Monitor tool: it waits for the run to end and
// prints what its reader says, at once if it has ended, so a wait can never miss the end. It gives up after two hours.
func OutputMonitor(number string, stdout, stderr io.Writer) int {
	query := func(line ...string) (string, int) {
		var output bytes.Buffer
		code := Run(timing.Started(), line, &output, stderr)
		return output.String(), code
	}
	return WatchOutput(number, query, time.Sleep, stdout)
}

// WatchOutput asks how the run stands until it has ended, then prints its summary. An output unknown at the first
// question is told at once; a failed question after that is a journal restarting, and the wait goes on for two minutes.
func WatchOutput(number string, query func(line ...string) (string, int), sleep func(time.Duration), stdout io.Writer) int {
	misses := 0
	for waited := time.Duration(0); waited < outputMonitorMost; waited += outputMonitorPause {
		status, code := query("output", "status", number)
		if code == SuccessCode {
			misses = 0
		} else {
			misses++
		}
		if code != SuccessCode && (waited == 0 || misses >= outputMonitorMisses) {
			fmt.Fprint(stdout, status)
			return code
		}
		if code == SuccessCode && !strings.Contains(status, outputRunningWord) {
			summary, summaryCode := query("output", "read", number, "--summary", "--again")
			fmt.Fprint(stdout, summary)
			return summaryCode
		}
		sleep(outputMonitorPause)
	}
	fmt.Fprintf(stdout, "output %s is still running after %s\n", number, outputMonitorMost)
	return ErrorCode
}
