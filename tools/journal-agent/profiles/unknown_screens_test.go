package profiles

import (
	"path/filepath"
	"slices"
	"testing"
	"time"

	"journal-agent/recording"
	"journal-agent/screen"
)

// classified replays a recording through a reader the layout builds, reading the screen as each chunk lands and
// just before the next one, and gives every reading in order.
func classified(t *testing.T, folder string, layout screen.Layout) []screen.Classification {
	t.Helper()
	fixture, err := recording.Load(filepath.Join("../testdata/recordings", folder))
	if err != nil {
		t.Fatal(err)
	}
	reader, err := layout.NewReader(120, 40, screen.DefaultLimits)
	if err != nil {
		t.Fatal(err)
	}
	classifier := screen.NewClassifier(layout, reader)
	start := time.Unix(0, 0)
	var seen []screen.Classification
	for index, chunk := range fixture.Output {
		if err := reader.Feed(chunk.Bytes); err != nil {
			t.Fatal(err)
		}
		next := start.Add(chunk.Offset + time.Second)
		if index+1 < len(fixture.Output) {
			next = start.Add(fixture.Output[index+1].Offset)
		}
		seen = append(seen, classifier.Classify(start.Add(chunk.Offset)))
		seen = append(seen, classifier.Classify(next.Add(-time.Millisecond)))
	}

	return seen
}

func TestARecordedMenuNoFamilyKnowsReadsUnknownWithOptionsAndBecomesStable(t *testing.T) {
	layout := ClaudeCode{}.Screens()
	layout.Menus = slices.DeleteFunc(slices.Clone(layout.Menus), func(family screen.MenuFamily) bool {
		return family.Name == "folder-trust"
	})

	readings := classified(t, "claude-code/2.1.323/screens/folder-trust", layout)

	last := readings[len(readings)-1]
	if last.Kind != screen.Unknown || !last.Options || !last.Stable || last.Generation == 0 {
		t.Fatalf("the trust menu no family knows ended as %+v", last)
	}
}

func TestARecordedTurnBeingDrawnIsNeverAStablePicker(t *testing.T) {
	readings := classified(t, "claude-code/2.1.323/turns/terminal-turn", ClaudeCode{}.Screens())

	for at, reading := range readings {
		if reading.Kind == screen.Unknown && reading.Stable && reading.Options {
			t.Fatalf("reading %d of the turn was a stable picker: %+v", at, reading)
		}
	}
}
