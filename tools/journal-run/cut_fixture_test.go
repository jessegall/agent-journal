package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"sort"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/anonymise"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

const (
	cutFixturePath     = "testdata/cut_lines.json"
	writeFixtureName   = "JOURNAL_CORPUS_WRITE_FIXTURE"
	mostFixtureLineLen = 160
	linesPerShape      = 2
	mostFixtureLines   = 400
)

// privateLine is a line that names something of a project, a person or a place, which no fixture of the repository holds.
var privateLine = regexp.MustCompile(`(?i)~|/users|/home|/private|/tmp|@|https?:|example-key|sir |jesse|transportklok|trackmijn|workodo|\.journal|\bjournal\b|[0-9a-f]{7,}|"[^"]{30,}"|'[^']{30,}'`)

// shapeWords are what tell one way of cutting a line from another.
var shapeWords = regexp.MustCompile(`&&|\|\||\|&|\||;|&>|2>&1|2>|>>|>|<<-?|<\(|\$\(|\beval\b|\bexec\b|&|\n|\bif\b|\bfor\b|\bwhile\b|\(|\{|/dev/null|\\$`)

// cutCase is one line and how it must be cut.
type cutCase struct {
	Line  string `json:"line"`
	Parts []Part `json:"parts"`
}

func cutCaseOf(line string) cutCase {
	return cutCase{Line: line, Parts: Parts(line)}
}

func shapeOf(line string) string {
	return strings.Join(shapeWords.FindAllString(line, -1), " ")
}

// TestWriteTheCutFixture writes the fixture from the private corpus, only when asked: at most a few short lines of each
// shape, none that names anything private.
func TestWriteTheCutFixture(t *testing.T) {
	if os.Getenv(writeFixtureName) == "" {
		t.Skipf("%s asks for the fixture", writeFixtureName)
	}
	lines := corpusLines(t, corpusFile(t))
	random := rand.New(rand.NewSource(corpusSeed))
	random.Shuffle(len(lines), func(first, second int) { lines[first], lines[second] = lines[second], lines[first] })
	cleaner := anonymise.New(nil)
	shapes := map[string][]string{}
	for _, line := range lines {
		clean := cleaner.Anonymised(line)
		if len(clean) > mostFixtureLineLen || privateLine.MatchString(clean) || strings.Contains(clean, "<<") != strings.Contains(line, "<<") {
			continue
		}
		if _, _, err := shell.Split(clean); err != nil {
			continue
		}
		if shape := shapeOf(clean); len(shapes[shape]) < linesPerShape {
			shapes[shape] = append(shapes[shape], clean)
		}
	}
	names := make([]string, 0, len(shapes))
	for name := range shapes {
		names = append(names, name)
	}
	sort.Slice(names, func(first, second int) bool {
		return strings.Count(names[first], " ") > strings.Count(names[second], " ") || (strings.Count(names[first], " ") == strings.Count(names[second], " ") && names[first] < names[second])
	})
	var cases []cutCase
	for _, name := range names {
		if len(cases) >= mostFixtureLines {
			break
		}
		for _, line := range shapes[name] {
			cases = append(cases, cutCaseOf(line))
		}
	}
	for _, line := range sameAsShellLines {
		cases = append(cases, cutCaseOf(line))
	}
	text, err := json.MarshalIndent(cases, "", " ")
	if err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Dir(cutFixturePath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(cutFixturePath, append(text, '\n'), 0o644); err != nil {
		t.Fatal(err)
	}
	t.Logf("%d lines from %d shapes", len(cases), len(shapes))
}

// TestEveryFixtureLineIsCutAsItWas locks how lines are cut, without running any of them: a line that is cut otherwise
// fails here, and the fixture is written anew only once the new cut has passed the comparison with plain shells.
func TestEveryFixtureLineIsCutAsItWas(t *testing.T) {
	text, err := os.ReadFile(cutFixturePath)
	if err != nil {
		t.Fatal(err)
	}
	var cases []cutCase
	if err := json.Unmarshal(text, &cases); err != nil {
		t.Fatal(err)
	}
	for _, recorded := range cases {
		cut := cutCaseOf(recorded.Line)
		if fmt.Sprint(cut) != fmt.Sprint(recorded) {
			t.Errorf("%q is cut otherwise:\n now %+v\n was %+v", recorded.Line, cut.Parts, recorded.Parts)
		}
		if _, err := shell.Parse(Script(cut.Parts, "/folder")); err != nil && !slices.Contains(sameAsShellLines, recorded.Line) {
			t.Errorf("%q gives a script no shell reads: %v", recorded.Line, err)
		}
	}
}
