package drivers

import "strings"

// pasteStart and pasteEnd bracket text the terminal takes as one paste: a newline inside it is part of the text and
// never submits the composer.
const (
	pasteStart = "\x1b[200~"
	pasteEnd   = "\x1b[201~"
)

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

// pastedText is the sanitized text as one bracketed paste, the form the terminal input gate types.
func pastedText(text string) string {
	return pasteStart + sanitizedText(text) + pasteEnd
}
