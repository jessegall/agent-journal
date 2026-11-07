package launch

import (
	"regexp"
	"strings"
	"unicode/utf8"
)

// The colour codes used by the boot menu.
const (
	boldCode   = "\x1b[1m"
	dimCode    = "\x1b[2m"
	accentCode = "\x1b[38;5;111m"
	goodCode   = "\x1b[38;5;114m"
	badgeCode  = "\x1b[38;5;176m"
	warnCode   = "\x1b[38;5;215m"
	resetCode  = "\x1b[0m"
)

var colourCodes = regexp.MustCompile(`\x1b\[[0-9;]*m`)

// Style is how a terminal shows the boot menu: in colour or plain, and how many columns a line may take (0 when the
// terminal cannot say).
type Style struct {
	Colour  bool
	Columns int
}

func (style Style) colour(code, text string) string {
	if !style.Colour {
		return text
	}
	return code + text + resetCode
}

// Accent colours the question mark, cursor and banner frame.
func (style Style) Accent(text string) string { return style.colour(accentCode, text) }

// Bold colours a heading or the option under the cursor.
func (style Style) Bold(text string) string { return style.colour(boldCode, text) }

// Dim colours the notes and the key hints.
func (style Style) Dim(text string) string { return style.colour(dimCode, text) }

// Good colours a finished step.
func (style Style) Good(text string) string { return style.colour(goodCode, text) }

// Badge colours a fact set after an option, in square brackets.
func (style Style) Badge(text string) string { return style.colour(badgeCode, "["+text+"]") }

// Warn colours the heading of a question asked before something is stopped or removed.
func (style Style) Warn(text string) string { return style.colour(warnCode+boldCode, text) }

// Fit cuts a line to the columns of the terminal, keeping its colour codes whole, so a long line never wraps into the next.
func (style Style) Fit(line string) string {
	room := style.Columns - 1
	if style.Columns == 0 {
		return line
	}
	var fitted strings.Builder
	shown, parts := 0, colourCodes.FindAllStringIndex(line, -1)
	position := 0
	for _, part := range append(parts, []int{len(line), len(line)}) {
		text := line[position:part[0]]
		kept := []rune(text)
		if len(kept) > room-shown {
			kept = kept[:max(room-shown, 0)]
		}
		fitted.WriteString(string(kept))
		shown += utf8.RuneCountInString(text)
		fitted.WriteString(line[part[0]:part[1]])
		position = part[1]
	}
	if shown > room && len(parts) > 0 {
		fitted.WriteString(resetCode)
	}
	return fitted.String()
}
