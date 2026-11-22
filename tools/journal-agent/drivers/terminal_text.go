package drivers

import "strings"

// sanitizedText keeps what a participant wrote as plain text: newlines and tabs stay, every other control character
// goes, so no body can close the paste, move the cursor or press a key.
func sanitizedText(text string) string {
	return strings.Map(func(r rune) rune {
		if r == '\n' || r == '\t' {
			return r
		}
		if r < 0x20 || r == 0x7f || (r >= 0x80 && r < 0xa0) {
			return -1
		}
		return r
	}, text)
}
