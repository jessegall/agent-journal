package launch

import "strings"

// escapeState is how far an escape sequence read from the terminal has come.
type escapeState int

const (
	noEscape escapeState = iota
	afterEscape
	controlSequence
	functionKey
	stringSequence
	stringEnding
)

// inputLine follows what a person has typed at a terminal and not entered: characters add to it, a backspace takes the last
// away, an Enter ends it, and an escape sequence is passed over whole, whether from a key such as an arrow or a terminal's
// answer to a question its program asked.
type inputLine struct {
	text  []rune
	state escapeState
}

// keys takes the keys read, and gives the line they entered, if any.
func (line *inputLine) keys(keys []byte) string {
	entered := ""
	for _, character := range string(keys) {
		switch {
		case line.state != noEscape:
			line.escape(character)
		case character == 0x1b:
			line.state = afterEscape
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

// escape passes over the rest of an escape sequence: a bracket opens one that ends at its final byte, an O a function key,
// and P, ], _, ^ or X a string that a string terminator or a bell ends.
func (line *inputLine) escape(character rune) {
	switch line.state {
	case afterEscape:
		line.state = sequenceOpenedBy(character)
	case controlSequence:
		if character >= 0x40 && character <= 0x7e {
			line.state = noEscape
		}
	case functionKey:
		if !strings.ContainsRune("0123456789;", character) {
			line.state = noEscape
		}
	case stringSequence:
		switch character {
		case 0x1b:
			line.state = stringEnding
		case 0x07:
			line.state = noEscape
		}
	case stringEnding:
		line.state = stringSequence
		if character == '\\' {
			line.state = noEscape
		}
	}
}

func sequenceOpenedBy(character rune) escapeState {
	switch character {
	case '[':
		return controlSequence
	case 'O':
		return functionKey
	case 'P', ']', '_', '^', 'X':
		return stringSequence
	}
	return noEscape
}
