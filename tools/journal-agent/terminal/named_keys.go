package terminal

// The terminal sequences of the keys a browser writer and the key scripts send, in one place.
const (
	KeyArrowUp    = "\x1b[A"
	KeyArrowDown  = "\x1b[B"
	KeyArrowRight = "\x1b[C"
	KeyArrowLeft  = "\x1b[D"
	KeyHome       = "\x1b[H"
	KeyEnd        = "\x1b[F"
	KeyPageUp     = "\x1b[5~"
	KeyPageDown   = "\x1b[6~"
	KeyTab        = "\t"
	KeyShiftTab   = "\x1b[Z"
	KeyEscape     = "\x1b"
	KeyBackspace  = "\x7f"
	KeyDelete     = "\x1b[3~"
)

// namedKeys are the keys a browser writer may name, by the names the journal's TerminalNamedKey enum gives them.
var namedKeys = map[string]string{
	"up":        KeyArrowUp,
	"down":      KeyArrowDown,
	"right":     KeyArrowRight,
	"left":      KeyArrowLeft,
	"home":      KeyHome,
	"end":       KeyEnd,
	"page_up":   KeyPageUp,
	"page_down": KeyPageDown,
	"tab":       KeyTab,
	"shift_tab": KeyShiftTab,
	"escape":    KeyEscape,
	"backspace": KeyBackspace,
	"delete":    KeyDelete,
}

// KeySequence is the terminal sequence of a named key, Ctrl and a letter included; found is false for any other name.
func KeySequence(name string) (sequence string, found bool) {
	if sequence, found := namedKeys[name]; found {
		return sequence, true
	}
	if len(name) == len("ctrl_a") && name[:5] == "ctrl_" && name[5] >= 'a' && name[5] <= 'z' {
		return string(rune(name[5] - 'a' + 1)), true
	}

	return "", false
}
