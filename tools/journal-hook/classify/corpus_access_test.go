package classify

import (
	"bufio"
	"encoding/json"
	"os"
	"regexp"
	"slices"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

const shownNames = 40

// A program's name is printed only when it looks like one, so no text of a line can come out as a name.
var programName = regexp.MustCompile(`^[A-Za-z0-9._-]{1,30}$`)

// Every corpus line goes through what the read-only rule asks of a line, and the counts and the refused programs are
// printed by name. Classifying a line never runs it, and no line of the corpus is printed.
func TestTheCorpusThroughTheReadOnlyRule(t *testing.T) {
	path := os.Getenv(corpusVariable)
	if path == "" {
		t.Skipf("%s names no corpus file", corpusVariable)
	}
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	answers, refused := map[string]int{}, map[string]map[string]int{}
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	for scanner.Scan() {
		var line string
		if json.Unmarshal(scanner.Bytes(), &line) != nil || line == "" {
			continue
		}
		answer, program := readOnlyVerdict(shippedClassifier.Line(line))
		answers[answer]++
		if program == "" || !programName.MatchString(program) {
			continue
		}
		if refused[answer] == nil {
			refused[answer] = map[string]int{}
		}
		refused[answer][program]++
	}
	t.Logf("answers: %v", answers)
	for answer, programs := range refused {
		t.Logf("refused as %s: %v", answer, topNames(programs))
	}
}

// readOnlyVerdict is what the read-only rule's checks answer for a line, and the program of the part that decided it.
func readOnlyVerdict(line event.ShellLine) (string, string) {
	if line.ParseError != "" || len(line.Parts) == 0 {
		return "other", ""
	}
	for _, part := range line.Parts {
		classification := part.Classification
		switch {
		case classification.Uncertain:
			return "uncertain", part.Program
		case hasEffect(classification.Effects, writesFiles):
			return "other", part.Program
		case classification.Category == "process":
			return "process", part.Program
		case classification.Category == unknown:
			return "unknown", part.Program
		case !slices.Contains([]string{"read", "search", journalCategory}, classification.Category):
			return "other", part.Program
		}
	}
	return "allowed", ""
}

func topNames(programs map[string]int) []string {
	names := make([]string, 0, len(programs))
	for name := range programs {
		names = append(names, name)
	}
	slices.SortFunc(names, func(first, second string) int { return programs[second] - programs[first] })
	return names[:min(shownNames, len(names))]
}
