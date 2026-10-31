package classify

import (
	"bufio"
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// What version 4 recorded of a shell line it read, beside each recorded hook body in testdata/version4.
type version4Call struct {
	Command string `json:"command"`
	Parts   []struct {
		Text   string   `json:"text"`
		Writes bool     `json:"writes"`
		Files  []string `json:"files"`
	} `json:"parts"`
}

// version4Part is how the Go reading names one part of version 4: the run of commands joined by || or a pipe, whether
// it writes and the files it writes or, when it does not, prints.
type version4Part struct {
	Text   string
	Writes bool
	Files  []string
}

func (classifier *Classifier) version4Parts(line string) []version4Part {
	commands, _, err := shell.Split(line)
	if err != nil {
		return nil
	}
	var parts []version4Part
	for _, run := range shell.Runs(commands) {
		text := runText(run)
		var classifications []Classification
		files := []string{}
		for _, command := range run {
			classifications = append(classifications, classifier.Classify(command.Text))
		}
		writes := Union(classifications).IsWrite()
		for _, command := range run {
			if writes {
				files = append(files, classifier.WritePaths(command.Text)...)
			} else {
				files = append(files, classifier.ReadPaths(command.Text)...)
			}
		}
		parts = append(parts, version4Part{Text: text, Writes: writes, Files: files})
	}
	return parts
}

// The recorded calls are version 4's reading on the day it read them, 2026-10-23, with the table of that day; the split
// must match them, while a classification that differs is counted, since the table has changed since.
func TestEveryRecordedShellLineIsSplitAsVersion4SplitIt(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	differences, classified, lines := 0, 0, 0
	for _, event := range []string{"PreToolUse", "PostToolUse", "PostToolUseFailure"} {
		bodies := jsonLines(t, filepath.Join("..", "testdata", "recorded", "claude", event+".jsonl"))
		calls := jsonLines(t, filepath.Join("..", "testdata", "version4", "claude", event+".jsonl"))
		for index, raw := range calls {
			var call version4Call
			var body struct {
				ToolName string `json:"tool_name"`
			}
			if json.Unmarshal(raw, &call) != nil || call.Command == "" || json.Unmarshal(bodies[index], &body) != nil || body.ToolName != "Bash" {
				continue
			}
			lines++
			var want []version4Part
			for _, part := range call.Parts {
				want = append(want, version4Part{Text: part.Text, Writes: part.Writes, Files: append([]string{}, part.Files...)})
			}
			actual := classifier.version4Parts(call.Command)
			if !reflect.DeepEqual(partTexts(actual), partTexts(want)) {
				differences++
				t.Errorf("%s line %d %q\n go        %q\n version 4 %q", event, index+1, call.Command, partTexts(actual), partTexts(want))
			} else if !reflect.DeepEqual(actual, want) {
				classified++
			}
		}
	}
	t.Logf("%d of %d recorded shell lines split differently, %d classified differently", differences, lines, classified)
}

func partTexts(parts []version4Part) []string {
	texts := []string{}
	for _, part := range parts {
		texts = append(texts, part.Text)
	}
	return texts
}

func jsonLines(t *testing.T, path string) [][]byte {
	t.Helper()
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	var collected [][]byte
	for scanner.Scan() {
		collected = append(collected, []byte(strings.Clone(scanner.Text())))
	}
	return collected
}
