package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"testing"
)

// The recorded hook bodies: testdata/recorded/<program>/<hook event name>.jsonl, one body a line.
const recordedFolder = "testdata/recorded"

// The event name of the prepared object for each hook event name an agent program sends.
var eventNames = map[string]string{
	"PreToolUse":         "pre_tool_use",
	"PostToolUse":        "post_tool_use",
	"PostToolUseFailure": "post_tool_use",
	"UserPromptSubmit":   "prompt",
	"Stop":               "stop",
	"SessionStart":       "session_start",
	"SessionEnd":         "session_end",
	"PreCompact":         "compact",
}

// The events and tools each program's recordings must hold at least one body of.
var requiredEvents = map[string][]string{
	"claude": {"pre_tool_use", "post_tool_use", "prompt", "stop", "session_start", "session_end", "compact"},
}

var requiredTools = map[string][]string{
	"claude": {"Bash", "Edit", "Write", "Read"},
}

// A home folder or an email address left in a body means it was not anonymised.
var personal = regexp.MustCompile(`/(?:Users|home)/[^/\s"]|[\w.+-]+@[\w-]+\.[a-z]{2,}`)

type corpusRow struct {
	program string
	event   string
	tool    string
}

type corpusSize struct {
	bodies int
	bytes  int
	most   int
}

func TestCorpusHasEveryEventAndTool(t *testing.T) {
	files, err := filepath.Glob(filepath.Join(recordedFolder, "*", "*.jsonl"))
	if err != nil || len(files) == 0 {
		t.Fatalf("no recorded bodies under %s", recordedFolder)
	}
	sizes := map[corpusRow]*corpusSize{}
	for _, file := range files {
		readRecording(t, file, sizes)
	}
	t.Log("\n" + sizeTable(sizes))
	for program, events := range requiredEvents {
		for _, event := range events {
			if !hasRow(sizes, func(row corpusRow) bool { return row.program == program && row.event == event }) {
				t.Errorf("%s has no recorded body of the event %s", program, event)
			}
		}
	}
	for program, tools := range requiredTools {
		for _, tool := range tools {
			for _, event := range []string{"pre_tool_use", "post_tool_use"} {
				if !hasRow(sizes, func(row corpusRow) bool { return row.program == program && row.event == event && row.tool == tool }) {
					t.Errorf("%s has no recorded %s body of the tool %s", program, event, tool)
				}
			}
		}
	}
}

func readRecording(t *testing.T, file string, sizes map[corpusRow]*corpusSize) {
	t.Helper()
	opened, err := os.Open(file)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	program := filepath.Base(filepath.Dir(file))
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	for number := 1; scanner.Scan(); number++ {
		line := scanner.Text()
		var body struct {
			HookEventName string `json:"hook_event_name"`
			ToolName      string `json:"tool_name"`
		}
		if err := json.Unmarshal([]byte(line), &body); err != nil {
			t.Errorf("%s:%d is not a JSON body: %v", file, number, err)
			continue
		}
		for _, found := range personal.FindAllString(line, -1) {
			if found != "someone@example.com" {
				t.Errorf("%s:%d holds a personal path or address: %q", file, number, found)
			}
		}
		event, known := eventNames[body.HookEventName]
		if !known {
			event = body.HookEventName
		}
		row := corpusRow{program, event, body.ToolName}
		if sizes[row] == nil {
			sizes[row] = &corpusSize{}
		}
		sizes[row].bodies++
		sizes[row].bytes += len(line)
		sizes[row].most = max(sizes[row].most, len(line))
	}
	if err := scanner.Err(); err != nil {
		t.Fatalf("%s: %v", file, err)
	}
}

func hasRow(sizes map[corpusRow]*corpusSize, matches func(corpusRow) bool) bool {
	for row := range sizes {
		if matches(row) {
			return true
		}
	}
	return false
}

func sizeTable(sizes map[corpusRow]*corpusSize) string {
	rows := make([]corpusRow, 0, len(sizes))
	for row := range sizes {
		rows = append(rows, row)
	}
	sort.Slice(rows, func(i, j int) bool {
		return fmt.Sprint(rows[i]) < fmt.Sprint(rows[j])
	})
	var table strings.Builder
	fmt.Fprintf(&table, "%-8s %-14s %-40s %7s %11s %11s %11s\n", "program", "event", "tool", "bodies", "bytes", "mean bytes", "most bytes")
	for _, row := range rows {
		size := sizes[row]
		fmt.Fprintf(&table, "%-8s %-14s %-40s %7d %11d %11d %11d\n", row.program, row.event, row.tool, size.bodies, size.bytes, size.bytes/size.bodies, size.most)
	}
	return table.String()
}
