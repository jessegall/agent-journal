package main

import (
	"fmt"
	"strings"
)

// DefaultCapCharacters is how much of a part's output the agent sees whole, as version 4's command output cap.
const DefaultCapCharacters = 400

// Shown is what the agent sees of a part's output: all of it up to the cap, or whole when the cap is lifted for a
// line of journal commands; past the cap, one line naming the output and how to read it.
func Shown(text string, process, capCharacters int, whole bool) string {
	if whole || len(text) <= capCharacters {
		return text
	}
	lines := strings.Count(text, "\n")
	if !strings.HasSuffix(text, "\n") {
		lines++
	}
	return fmt.Sprintf("output %d is %d lines, %d characters: journal output read %d --summary\n", process, lines, len(text), process)
}
