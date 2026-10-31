package classify

import (
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// version4Chain is version 4's Chain reading of a line, rebuilt from the Go commands: each part as its text, its type
// (R recorded, ; after a ; and & after a &&, then & when a && follows) and the stages of its pipe.
func version4Chain(line string) ([][]any, error) {
	commands, _, err := shell.Split(line)
	if err != nil {
		return nil, err
	}
	runs := Runs(commands)
	parts := [][]any{}
	for index, run := range runs {
		preceding, following := "", run[len(run)-1].JoinedBy
		if index > 0 {
			preceding = runs[index-1][len(runs[index-1])-1].JoinedBy
		}
		recorded := map[bool]string{true: "R", false: "S"}[run[0].Recorded]
		partType := recorded + map[bool]string{true: "&", false: ";"}[preceding == "&&"] + map[bool]string{true: "&", false: ";"}[following == "&&"]
		var stages []any
		first := 0
		for position, command := range run {
			if position != len(run)-1 && command.PipedInto < 0 {
				continue
			}
			stages = append(stages, stageText(run, run[first:position+1], position == len(run)-1))
			first = position + 1
		}
		parts = append(parts, []any{runText(run), partType, stages})
	}
	return parts, nil
}

// stageText is the text of one stage of a pipe as the line writes it, between its pipes; the line's here-document
// bodies come after its last stage, as the line puts them there.
func stageText(run, stage []shell.Command, last bool) string {
	if len(run) == 1 {
		return run[0].Text
	}
	end := stage[len(stage)-1].End
	if last {
		end = runEnd(run)
	}
	return pyre.Strip(stage[0].Source[stage[0].Start:end])
}

// runText is the text of a version 4 part: a single command's own text, else the line from its first command to its
// last, through their here-documents' bodies.
func runText(run []shell.Command) string {
	if len(run) == 1 {
		return run[0].Text
	}
	return pyre.Strip(run[0].Source[run[0].Start:runEnd(run)])
}

func runEnd(run []shell.Command) int {
	end := 0
	for _, command := range run {
		end = max(end, command.End, command.BodyEnd)
	}
	return end
}

// Version 4's splitter fixture, tests/splitter/lines.jsonl as version 4 ships it, with the lines version 4 reads
// wrong corrected in splitter_corrections.json, each with its reason; a corrected line with no parts is one no shell
// can read.
func TestTheSplitterFixtureIsSplitAsVersion4SplitsIt(t *testing.T) {
	var corrections []struct {
		Line   string `json:"line"`
		Parts  []any  `json:"parts"`
		Reason string `json:"reason"`
	}
	text, err := os.ReadFile(filepath.Join("..", "testdata", "version4", "splitter_corrections.json"))
	if err != nil || json.Unmarshal(text, &corrections) != nil {
		t.Fatalf("splitter_corrections.json does not read: %v", err)
	}
	corrected := map[string][]any{}
	for _, correction := range corrections {
		if correction.Reason == "" {
			t.Errorf("the correction of %q gives no reason", correction.Line)
		}
		corrected[correction.Line] = correction.Parts
	}
	differences := 0
	lines := jsonLines(t, filepath.Join("..", "testdata", "version4", "splitter_lines.jsonl"))
	for _, raw := range lines {
		var fixture struct {
			Line  string `json:"line"`
			Parts []any  `json:"parts"`
		}
		if err := json.Unmarshal(raw, &fixture); err != nil {
			t.Fatal(err)
		}
		want, isCorrected := corrected[fixture.Line]
		if !isCorrected {
			want = fixture.Parts
		}
		actual, err := version4Chain(fixture.Line)
		if want == nil && err == nil || want != nil && (err != nil || !reflect.DeepEqual(toAny(actual), want)) {
			differences++
			t.Errorf("%q\n go        %v %v\n version 4 %v", fixture.Line, actual, err, want)
		}
	}
	t.Logf("%d of %d fixture lines split differently, %d corrected", differences, len(lines), len(corrections))
}

// toAny is a value as encoding/json reads it back, so a Go reading compares with a decoded fixture.
func toAny(value any) any {
	text, _ := json.Marshal(value)
	var decoded any
	_ = json.Unmarshal(text, &decoded)
	return decoded
}
