package screen

import (
	"strings"
	"unicode"
)

// wordJoiners are the characters a name such as GPT-6-Sol, Opus 5.5 or a_b is written with between its parts.
const wordJoiners = "-._"

// wordGoesOn is whether the text next to a word, read away from it, continues that word: it starts with a letter or a
// digit, or with a joiner such as - or . followed by one. So "GPT-6" ends at "GPT-6 (current)" or "GPT-6.", and goes
// on in "GPT-6-Sol" and "GPT-6.1".
func wordGoesOn(next []rune) bool {
	if len(next) == 0 {
		return false
	}
	if isLetterOrDigit(next[0]) {
		return true
	}

	return len(next) > 1 && strings.ContainsRune(wordJoiners, next[0]) && isLetterOrDigit(next[1])
}

func isLetterOrDigit(character rune) bool {
	return unicode.IsLetter(character) || unicode.IsDigit(character)
}
