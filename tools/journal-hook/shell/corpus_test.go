package shell

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"sync"
	"testing"

	"mvdan.cc/sh/v3/syntax"
)

// The whole command corpus is private and stays outside the repository: JOURNAL_CORPUS names its file, one command a
// line as a JSON string (.journal/corpus/whole_corpus.txt), and the test runs only where it is set. The lines split
// otherwise than shfmt counts them are written beside it, in go-splitter-failing.txt.
const corpusVariable = "JOURNAL_CORPUS"

// shfmtParts is the number of parts version 4's splitter check (scripts/splitter_check.py) reads from shfmt --tojson:
// one per statement, a && chain split into its commands and a pipeline or a || chain kept one part. Corrected from
// version 4's count: a statement that is only a redirect (> out.txt) counts as a part, where version 4 counted none,
// since it creates or empties its file and is a command of its own.
func shfmtParts(file *syntax.File) int {
	parts := 0
	for _, statement := range file.Stmts {
		switch {
		case statement.Cmd != nil:
			parts += commandParts(statement.Cmd)
		case len(statement.Redirs) > 0:
			parts++
		}
	}
	return parts
}

func commandParts(command syntax.Command) int {
	binary, isBinary := command.(*syntax.BinaryCmd)
	if !isBinary {
		return 1
	}
	joined := commandParts(binary.X.Cmd) + commandParts(binary.Y.Cmd)
	if binary.Op == syntax.AndStmt {
		return joined
	}
	return joined - 1
}

// Every corpus line bash parses is split into as many parts as shfmt counts in it; a line bash cannot parse is left to
// the zsh reading and the parse error, as version 4's check left it unjudged.
func TestEveryCorpusLineIsSplitAsShfmtCountsIt(t *testing.T) {
	path := os.Getenv(corpusVariable)
	if path == "" {
		t.Skipf("%s names no corpus file", corpusVariable)
	}
	lines := corpusLines(t, path)
	var mutex sync.Mutex
	var failing []string
	unparsed := 0
	queue := make(chan string, 1024)
	var workers sync.WaitGroup
	for range runtime.NumCPU() {
		workers.Add(1)
		go func() {
			defer workers.Done()
			for line := range queue {
				difference, parsedLine := splitDifference(line)
				mutex.Lock()
				if !parsedLine {
					unparsed++
				}
				if difference != "" {
					failing = append(failing, difference)
				}
				mutex.Unlock()
			}
		}()
	}
	for _, line := range lines {
		queue <- line
	}
	close(queue)
	workers.Wait()
	sort.Strings(failing)
	report := filepath.Join(filepath.Dir(path), "go-splitter-failing.txt")
	if err := os.WriteFile(report, []byte(strings.Join(failing, "\n")+"\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	for _, difference := range failing[:min(len(failing), 20)] {
		t.Error(difference)
	}
	t.Logf("%d lines: %d split otherwise than shfmt counts them (written to %s), %d bash cannot parse", len(lines), len(failing), report, unparsed)
}

// splitDifference says how a line's split differs from shfmt's count, empty when it does not; parsedLine is false for a
// line bash cannot parse.
func splitDifference(line string) (difference string, parsedLine bool) {
	file, err := parsed(line, syntax.LangBash)
	if err != nil {
		return "", false
	}
	commands, _, err := read(line)
	if err != nil {
		return fmt.Sprintf("Go cannot read a line bash parses: %v\t%q", err, line), true
	}
	expected, actual := shfmtParts(file), len(Runs(commands))
	if expected == actual {
		return "", true
	}
	return fmt.Sprintf("shfmt reads %d parts where Go reads %d\t%q", expected, actual, line), true
}

func corpusLines(t *testing.T, path string) []string {
	t.Helper()
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	var lines []string
	for scanner.Scan() {
		var line string
		if json.Unmarshal(scanner.Bytes(), &line) == nil && line != "" {
			lines = append(lines, line)
		}
	}
	return lines
}
