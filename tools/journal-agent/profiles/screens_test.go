package profiles

import (
	"path/filepath"
	"testing"
	"time"

	"journal-agent/recording"
	"journal-agent/screen"
)

// readings replays a recording through the profile's layout and lists each stable reading as it first appears.
func readings(t *testing.T, folder string, layout screen.Layout) []screen.Classification {
	t.Helper()
	fixture, err := recording.Load(filepath.Join("../testdata/recordings", folder))
	if err != nil {
		t.Fatal(err)
	}
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
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
		// Read once as the chunk lands and once just before the next one, as a live reader would while waiting.
		classifier.Classify(start.Add(chunk.Offset))
		reading := classifier.Classify(next.Add(-time.Millisecond))
		if reading.Stable && (len(seen) == 0 || seen[len(seen)-1] != reading) {
			seen = append(seen, reading)
		}
	}

	return seen
}

func has(readings []screen.Classification, kind screen.Kind, menu string) bool {
	for _, reading := range readings {
		if reading.Kind == kind && reading.Menu == menu {
			return true
		}
	}

	return false
}

func TestClaudeCodeRecordingsReadAsTheirMenuAndPrompt(t *testing.T) {
	layout := ClaudeCode{}.Screens()

	if trust := readings(t, "claude-code/2.1.323/screens/folder-trust", layout); !has(trust, screen.MenuShown, "folder-trust") {
		t.Fatalf("the folder-trust recording read as %+v", trust)
	}

	turn := readings(t, "claude-code/2.1.323/turns/terminal-turn", layout)
	if !has(turn, screen.MenuShown, "folder-trust") || !has(turn, screen.PromptReady, "") {
		t.Fatalf("the terminal turn read as %+v, not the trust menu and then a ready prompt", turn)
	}
}

func TestCodexRecordingsReachAReadyPrompt(t *testing.T) {
	layout := Codex{}.Screens()

	for _, folder := range []string{"codex/0.165.0/screens/first-start", "codex/0.165.0/turns/terminal-turn"} {
		if seen := readings(t, folder, layout); !has(seen, screen.PromptReady, "") {
			t.Fatalf("%s read as %+v, never a ready prompt", folder, seen)
		}
	}
}
