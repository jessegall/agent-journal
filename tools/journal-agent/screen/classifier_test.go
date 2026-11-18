package screen

import (
	"testing"
	"time"

	"journal-agent/screen/contracts"
)

// testLayout draws like Claude Code: a fenced ❯ composer, a ❯ option list for a trust menu and a spinner row.
func testLayout() Layout {
	return Layout{
		Buffer:            contracts.NormalBuffer,
		Composer:          FencedRow{Label: "composer", Marker: "❯ "},
		EmptyCursorColumn: 2,
		ComposerStableFor: 300 * time.Millisecond,
		Menus: []MenuFamily{{
			Name:        "trust",
			Options:     OptionList{Label: "menu", Markers: []string{"❯ "}},
			Keywords:    []string{"trust", "folder"},
			MinKeywords: 2,
			StableFor:   300 * time.Millisecond,
		}},
		Others: []contracts.Region{MarkedRow{Label: "spinner", Prefixes: []string{"✻ ", "✶ "}, Contains: "…"}},
	}
}

func newClassified(t *testing.T) (*EmulatorReader, *Classifier) {
	t.Helper()
	layout := testLayout()
	reader, err := NewEmulatorReader(40, 12, DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}

	return reader, NewClassifier(layout, reader)
}

func TestASpinnerRedrawBesideAMenuLeavesTheMenuStable(t *testing.T) {
	reader, classifier := newClassified(t)
	start := time.Unix(0, 0)
	reader.Feed([]byte("\x1b[2;1HDo you trust this folder?\x1b[4;1H❯ Yes, I trust it\x1b[5;1H  No, exit"))
	classifier.Classify(start)
	menuGeneration := reader.Generation("menu")

	for frame, glyph := range []string{"✻", "✶", "✻", "✶"} {
		reader.Feed([]byte("\x1b[8;1H" + glyph + " Thinking…"))
		at := start.Add(time.Duration(frame+1) * 100 * time.Millisecond)
		reading := classifier.Classify(at)
		if reading.Kind != MenuShown || reading.Menu != "trust" {
			t.Fatalf("frame %d read %+v, not the trust menu", frame, reading)
		}
	}

	if reader.Generation("menu") != menuGeneration {
		t.Fatal("a spinner redraw changed the menu's generation")
	}
	if reading := classifier.Classify(start.Add(400 * time.Millisecond)); !reading.Stable {
		t.Fatal("spinner redraws kept a still menu from counting as stable")
	}
}

func TestRewordedMenuTextStillMatchesItsFamily(t *testing.T) {
	reader, classifier := newClassified(t)
	reader.Feed([]byte("\x1b[1;1HIs this a FOLDER you Trust?\x1b[3;1H❯ Trust it\x1b[4;1H  Leave"))

	if reading := classifier.Classify(time.Unix(0, 0)); reading.Kind != MenuShown {
		t.Fatalf("a reworded trust menu read as %+v", reading)
	}
}

func TestModelTextThatLooksLikeAPromptIsNotPromptReady(t *testing.T) {
	reader, classifier := newClassified(t)
	reader.Feed([]byte("\x1b[3;1H❯ \x1b[3;3H"))

	if reading := classifier.Classify(time.Unix(5, 0)); reading.Kind == PromptReady {
		t.Fatal("a ❯ row without its fence read as the composer")
	}
}

func TestAnEmptyFencedComposerIsPromptReadyOnceStill(t *testing.T) {
	reader, classifier := newClassified(t)
	rule := "────────────────────────────────────────"
	reader.Feed([]byte("\x1b[5;1H" + rule + "\x1b[6;1H❯ \x1b[7;1H" + rule + "\x1b[6;3H"))
	start := time.Unix(0, 0)

	if reading := classifier.Classify(start); reading.Kind != PromptReady || reading.Stable {
		t.Fatalf("the first reading is %+v, not an unsettled prompt", reading)
	}
	if reading := classifier.Classify(start.Add(time.Second)); !reading.Stable {
		t.Fatal("a still composer did not settle")
	}

	reader.Feed([]byte("draft"))
	if reading := classifier.Classify(start.Add(2 * time.Second)); reading.Kind == PromptReady {
		t.Fatal("a composer holding a draft read as ready")
	}
}
