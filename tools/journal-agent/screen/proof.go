package screen

import (
	"errors"
	"slices"
	"strings"
)

// ErrEmptyProof refuses a proof with no text to look for.
var ErrEmptyProof = errors.New("a proof needs text to look for on the screen")

// Proof is the text that shows a step or an answer worked once it is on a stable screen. It is matched without loss:
// only case and white space are folded, so every digit, dot and dash counts, and it must stand as a whole word group.
type Proof struct {
	text string
}

// NewProof is the proof of the text; empty or white-space-only text is refused with ErrEmptyProof.
func NewProof(text string) (Proof, error) {
	if strings.TrimSpace(text) == "" {
		return Proof{}, ErrEmptyProof
	}

	return Proof{text: text}, nil
}

// Text is the proof as it was written.
func (proof Proof) Text() string {
	return proof.text
}

// SeenIn is whether one of the rows holds the proof as a whole word group: "GPT-6" is seen in "Model: GPT-6" and not
// in "GPT-5" or "GPT-6-Sol".
func (proof Proof) SeenIn(rows []string) bool {
	return slices.ContainsFunc(rows, proof.isInRow)
}

// AlreadyOn is whether the proof is on the screen when it is raised; such a proof proves nothing, and callers refuse
// it.
func (proof Proof) AlreadyOn(rows []string) bool {
	return proof.SeenIn(rows)
}

func (proof Proof) isInRow(row string) bool {
	wanted := []rune(foldForProof(proof.text))
	text := []rune(foldForProof(row))
	for start := 0; start+len(wanted) <= len(text); start++ {
		end := start + len(wanted)
		if slices.Equal(text[start:end], wanted) && !wordGoesOn(text[end:]) && !wordGoesOn(runesBefore(text, start)) {
			return true
		}
	}

	return false
}

// runesBefore is the two runes before the position, nearest first, so wordGoesOn reads them away from the word.
func runesBefore(text []rune, position int) []rune {
	before := slices.Clone(text[max(0, position-2):position])
	slices.Reverse(before)

	return before
}

// foldForProof folds case and white space, no-break spaces too, and nothing else.
func foldForProof(text string) string {
	return collapseSpaces(strings.ToLower(text))
}
