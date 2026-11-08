package launch

import "strings"

// inputLine follows what a person has typed at a terminal and not entered: characters add to it, a backspace takes the last
// away, an Enter or an escape sequence from a key such as an arrow ends it or is passed over.
type inputLine struct {
	text     []rune
	escaping bool
	sequence bool
}

// keys takes the keys read, and gives the line they entered, if any.
func (line *inputLine) keys(keys []byte) string {
	entered := ""
	for _, character := range string(keys) {
		switch {
		case line.escaping:
			line.escape(character)
		case character == 0x1b:
			line.escaping, line.sequence = true, false
		case character == '\r' || character == '\n':
			entered = string(line.text)
			line.text = line.text[:0]
		case character == 0x7f || character == 0x08:
			if len(line.text) > 0 {
				line.text = line.text[:len(line.text)-1]
			}
		case character == 0x15:
			line.text = line.text[:0]
		case character >= 0x20:
			line.text = append(line.text, character)
		}
	}
	return entered
}

// escape passes over the rest of an escape sequence: a bracket opens one that ends at a letter or a tilde.
func (line *inputLine) escape(character rune) {
	if !line.sequence && (character == '[' || character == 'O') {
		line.sequence = true
		return
	}
	if line.sequence && !strings.ContainsRune("0123456789;", character) {
		line.escaping = false
		return
	}
	if !line.sequence {
		line.escaping = false
	}
}
