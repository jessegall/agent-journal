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

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// The recorded hook bodies: testdata/recorded/<program>/<hook event name>.jsonl, one body a line.
const recordedFolder = "testdata/recorded"

// The events and tools each program's recordings must hold at least one body of.
var requiredEvents = map[string][]string{
	"claude": {"pre_tool_use", "post_tool_use", "prompt", "stop", "session_start", "session_end", "compact"},
	"codex":  {"pre_tool_use", "post_tool_use", "prompt", "stop", "session_start", "session_end"},
}

var requiredTools = map[string][]string{
	"claude": {"Bash", "Edit", "Write", "Read"},
	"codex":  {"Bash", "apply_patch"},
}

// A home folder or an email address left in a text of a body means it was not anonymised.
var personal = regexp.MustCompile(`/(?:Users|home)/[^/\s"]|[\w.+-]+@[\w-]+\.[a-z]{2,}`)

// The private words the bodies were anonymised with, one a line; the file lives outside the repository, so the check
// runs only on a machine that has it.
const privateWordsFile = ".config/journal-hook/private-words"

type corpusRow struct {
	program string
	event   string
	tool    string
}

type corpusSize struct {
	bodies  int
	bytes   int
	largest int
}

func TestCorpusHasEveryEventAndTool(t *testing.T) {
	files, err := filepath.Glob(filepath.Join(recordedFolder, "*", "*.jsonl"))
	if err != nil || len(files) == 0 {
		t.Fatalf("no recorded bodies under %s", recordedFolder)
	}
	sizes := map[corpusRow]*corpusSize{}
	items := privateWords(t)
	for _, file := range files {
		readRecording(t, file, sizes, items)
	}
	t.Log("\n" + sizeTable(sizes))
	for program, events := range requiredEvents {
		for _, event := range events {
			if hasRow(sizes, func(row corpusRow) bool { return row.program == program && row.event == event }) {
				continue
			}
			t.Errorf("%s has no recorded body of the event %s", program, event)
		}
	}
	for program, tools := range requiredTools {
		for _, tool := range tools {
			for _, event := range []string{"pre_tool_use", "post_tool_use"} {
				if hasRow(sizes, func(row corpusRow) bool { return row.program == program && row.event == event && row.tool == tool }) {
					continue
				}
				t.Errorf("%s has no recorded %s body of the tool %s", program, event, tool)
			}
		}
	}
}

func privateWords(t *testing.T) []string {
	home, _ := os.UserHomeDir()
	text, err := os.ReadFile(filepath.Join(home, privateWordsFile))
	if err != nil {
		t.Logf("no %s on this machine: the bodies are not checked for private words", privateWordsFile)
		return nil
	}
	var items []string
	for _, line := range strings.Split(string(text), "\n") {
		if word := strings.TrimSpace(line); word != "" {
			items = append(items, strings.ToLower(word))
		}
	}
	return items
}

// texts gives every string value inside a decoded body.
func texts(value any) []string {
	switch value := value.(type) {
	case string:
		return []string{value}
	case map[string]any:
		var collected []string
		for _, inner := range value {
			collected = append(collected, texts(inner)...)
		}
		return collected
	case []any:
		var collected []string
		for _, inner := range value {
			collected = append(collected, texts(inner)...)
		}
		return collected
	}
	return nil
}

func readRecording(t *testing.T, file string, sizes map[corpusRow]*corpusSize, items []string) {
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
		var body map[string]any
		if err := json.Unmarshal([]byte(line), &body); err != nil {
			t.Errorf("%s:%d is not a JSON body: %v", file, number, err)
			continue
		}
		for _, text := range texts(body) {
			for _, personalText := range personal.FindAllString(text, -1) {
				if personalText == "someone@example.com" {
					continue
				}
				t.Errorf("%s:%d holds a personal path or address: %q", file, number, personalText)
			}
			for _, word := range items {
				if !strings.Contains(strings.ToLower(text), word) {
					continue
				}
				t.Errorf("%s:%d holds a private word", file, number)
			}
		}
		hookEventName, _ := body["hook_event_name"].(string)
		toolName, _ := body["tool_name"].(string)
		event, frozen := programs.EventName(hookEventName)
		if !frozen {
			event = hookEventName
		}
		row := corpusRow{program, event, toolName}
		if sizes[row] == nil {
			sizes[row] = &corpusSize{}
		}
		sizes[row].bodies++
		sizes[row].bytes += len(line)
		sizes[row].largest = max(sizes[row].largest, len(line))
	}
	if err := scanner.Err(); err != nil {
		t.Fatalf("%s: %v", file, err)
	}
}

func hasRow(sizes map[corpusRow]*corpusSize, matches func(corpusRow) bool) bool {
	for row := range sizes {
		if !matches(row) {
			continue
		}
		return true
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
		fmt.Fprintf(&table, "%-8s %-14s %-40s %7d %11d %11d %11d\n", row.program, row.event, row.tool, size.bodies, size.bytes, size.bytes/size.bodies, size.largest)
	}
	return table.String()
}
