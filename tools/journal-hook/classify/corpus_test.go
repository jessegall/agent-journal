package classify

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"runtime"
	"sync"
	"testing"
	"time"
)

// The whole command corpus is private and stays outside the repository: JOURNAL_CORPUS names its file, one command a
// line as a JSON string (.journal/corpus/whole_corpus.txt), and the test runs only where it is set.
const corpusVariable = "JOURNAL_CORPUS"

// How long one line may take to be read before it counts as too slow.
const slowLine = time.Second

type corpusCount struct {
	lines, parseErrors, unknownLines, parts, unknownParts, slow int
	panics                                                      []string
}

// Every line of the corpus gets a reading without a panic, and the share of lines and parts the table does not know
// is reported.
func TestEveryCorpusLineGetsAReading(t *testing.T) {
	path := os.Getenv(corpusVariable)
	if path == "" {
		t.Skipf("%s names no corpus file", corpusVariable)
	}
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	lines := make(chan string, 1024)
	counts := make([]corpusCount, runtime.NumCPU())
	var workers sync.WaitGroup
	for index := range counts {
		workers.Add(1)
		go func(count *corpusCount) {
			defer workers.Done()
			for line := range lines {
				count.read(line)
			}
		}(&counts[index])
	}
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	for scanner.Scan() {
		var line string
		if json.Unmarshal(scanner.Bytes(), &line) == nil && line != "" {
			lines <- line
		}
	}
	close(lines)
	workers.Wait()
	var total corpusCount
	for _, count := range counts {
		total.lines += count.lines
		total.parseErrors += count.parseErrors
		total.unknownLines += count.unknownLines
		total.parts += count.parts
		total.unknownParts += count.unknownParts
		total.slow += count.slow
		total.panics = append(total.panics, count.panics...)
	}
	for _, line := range total.panics {
		t.Errorf("reading panicked on %q", line)
	}
	if total.slow > 0 {
		t.Errorf("%d lines took longer than %s to read", total.slow, slowLine)
	}
	t.Logf("%d lines read: %d no shell can parse (%.2f%%), %d of category unknown (%.2f%%); %d parts, %d of an unknown program (%.2f%%)",
		total.lines, total.parseErrors, percent(total.parseErrors, total.lines), total.unknownLines, percent(total.unknownLines, total.lines),
		total.parts, total.unknownParts, percent(total.unknownParts, total.parts))
}

func (count *corpusCount) read(line string) {
	defer func() {
		if recovered := recover(); recovered != nil {
			count.panics = append(count.panics, fmt.Sprint(line, ": ", recovered))
		}
	}()
	started := time.Now()
	shellLine := shippedClassifier.Line(line)
	if time.Since(started) > slowLine {
		count.slow++
	}
	count.lines++
	if shellLine.ParseError != "" {
		count.parseErrors++
	}
	if shellLine.Category == unknown {
		count.unknownLines++
	}
	for _, part := range shellLine.Parts {
		count.parts++
		if part.Classification.Category == unknown {
			count.unknownParts++
		}
	}
}

func percent(count, total int) float64 {
	if total == 0 {
		return 0
	}
	return 100 * float64(count) / float64(total)
}
