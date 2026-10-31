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

type corpusTally struct {
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
	tallies := make([]corpusTally, runtime.NumCPU())
	var workers sync.WaitGroup
	for index := range tallies {
		workers.Add(1)
		go func(tally *corpusTally) {
			defer workers.Done()
			for line := range lines {
				tally.read(line)
			}
		}(&tallies[index])
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
	var total corpusTally
	for _, tally := range tallies {
		total.lines += tally.lines
		total.parseErrors += tally.parseErrors
		total.unknownLines += tally.unknownLines
		total.parts += tally.parts
		total.unknownParts += tally.unknownParts
		total.slow += tally.slow
		total.panics = append(total.panics, tally.panics...)
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

func (tally *corpusTally) read(line string) {
	defer func() {
		if recovered := recover(); recovered != nil {
			tally.panics = append(tally.panics, fmt.Sprint(line, ": ", recovered))
		}
	}()
	began := time.Now()
	reading := shippedClassifier.Line(line)
	if time.Since(began) > slowLine {
		tally.slow++
	}
	tally.lines++
	if reading.ParseError != "" {
		tally.parseErrors++
	}
	if reading.Category == unknown {
		tally.unknownLines++
	}
	for _, part := range reading.Parts {
		tally.parts++
		if part.Classification.Category == unknown {
			tally.unknownParts++
		}
	}
}

func percent(count, total int) float64 {
	if total == 0 {
		return 0
	}
	return 100 * float64(count) / float64(total)
}
