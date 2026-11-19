package screen

import (
	"errors"
	"testing"
)

func proofOf(t *testing.T, text string) Proof {
	t.Helper()
	proof, err := NewProof(text)
	if err != nil {
		t.Fatal(err)
	}

	return proof
}

func TestAProofIsSeenOnlyAsAWholeWordGroupWithEveryCharacterCounting(t *testing.T) {
	seen := map[string]string{
		"GPT-6":          "Model: GPT-6",
		"gpt-6":          "Model: GPT-6 (current)",
		"Opus 5.5":       "Switched to opus  5.5.",
		"servers ready":  "3 SERVERS   ready",
		"Model set":      "│ Model set │",
		"~/work/journal": "cwd ~/work/journal",
	}
	for text, row := range seen {
		if !proofOf(t, text).SeenIn([]string{"", row}) {
			t.Fatalf("%q was not seen in %q", text, row)
		}
	}
	notSeen := map[string]string{
		"GPT-6":  "GPT-6-Sol",
		"GPT-6 ": "Model: GPT-5",
		"5.5":    "Opus 5.4",
		"Opus":   "Opus5",
		"6-Sol":  "GPT-6-Sol",
		"5":      "Opus 5.5",
	}
	for text, row := range notSeen {
		if proofOf(t, text).SeenIn([]string{row}) {
			t.Fatalf("%q was seen in %q", text, row)
		}
	}
}

func TestAnEmptyProofIsRefused(t *testing.T) {
	for _, text := range []string{"", "   ", " \t"} {
		if _, err := NewProof(text); !errors.Is(err, ErrEmptyProof) {
			t.Fatalf("NewProof(%q) gave %v", text, err)
		}
	}
}

func TestAProofGivesTheSameAnswerAtRaiseTimeInAReplayAndInAnAnswer(t *testing.T) {
	proof := proofOf(t, "GPT-6")
	for _, rows := range [][]string{{"Model: GPT-6"}, {"Model: GPT-5"}, {"GPT-6-Sol"}} {
		inReplay, inAnswer, atRaise := proof.SeenIn(rows), proofOf(t, "GPT-6").SeenIn(rows), proof.AlreadyOn(rows)
		if inReplay != inAnswer || inReplay != atRaise {
			t.Fatalf("%v gave %v, %v and %v", rows, inReplay, inAnswer, atRaise)
		}
	}
}
