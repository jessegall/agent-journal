package main

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"testing"
)

// runnerStarts names each file of the runner that starts a program itself, and why: the runner is the door of an
// agent's shell line, so its starts are the door's own; any other file that starts a program fails the test below.
var runnerStarts = map[string]string{
	"bypass.go":        "runs the line as it is when no server answers, the one case with no queue to ask",
	"client.go":        "calls the journal command that records the line's process row and its parts",
	"count_listing.go": "lists the tests of a queued run before it takes its place",
	"run.go":           "runs the line's parts, its output cutter, its follower and the hook program",
	"sandbox.go":       "wraps a part in the sandbox program",
	"sandbox_linux.go": "checks once whether the Linux sandbox works",
}

var programStart = regexp.MustCompile(`exec\.Command(Context)?\(`)

func TestEveryFileThatStartsAProgramIsAStartOfTheRunnerWithItsReason(t *testing.T) {
	files, err := filepath.Glob("*.go")
	if err != nil {
		t.Fatal(err)
	}
	var unlistedFiles []string
	for _, file := range files {
		if strings.HasSuffix(file, "_test.go") {
			continue
		}
		text, err := os.ReadFile(file)
		if err != nil {
			t.Fatal(err)
		}
		if _, registered := runnerStarts[file]; programStart.Match(text) && !registered {
			unlistedFiles = append(unlistedFiles, file)
		}
	}
	sort.Strings(unlistedFiles)
	if len(unlistedFiles) > 0 {
		t.Fatalf("these files start a program and are not named among the runner's starts with a reason: %v", unlistedFiles)
	}
	for file, reason := range runnerStarts {
		if _, err := os.Stat(file); err != nil || reason == "" {
			t.Fatalf("%s is named among the runner's starts but is gone or has no reason", file)
		}
	}
}
