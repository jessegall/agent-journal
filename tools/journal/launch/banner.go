package launch

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

const minimumBannerWidth = 44

// Banner is the framed box at the top of every screen of the boot menu: which program starts and in which project.
func Banner(style Style, program, project string) string {
	lines := []string{"agent-journal", "", fmt.Sprintf("You're about to start %s under the journal,", capitalised(program)), "in " + project + ".", "", "Move with ↑ ↓ and pick with Enter."}
	width := minimumBannerWidth
	for _, line := range lines {
		width = max(width, utf8.RuneCountInString(line)+2)
	}
	if style.Columns > 0 {
		width = min(width, max(style.Columns-4, minimumBannerWidth))
	}
	frame := strings.Repeat("─", width)
	rows := []string{style.Accent("┌" + frame + "┐")}
	for _, line := range lines {
		rows = append(rows, "│ "+fmt.Sprintf("%-*s", width-2, cut(line, width-2))+" │")
	}
	rows = append(rows, style.Accent("└"+frame+"┘"), "")
	return strings.Join(rows, "\r\n")
}

func capitalised(text string) string {
	if text == "" {
		return text
	}
	first, size := utf8.DecodeRuneInString(text)
	return strings.ToUpper(string(first)) + text[size:]
}
