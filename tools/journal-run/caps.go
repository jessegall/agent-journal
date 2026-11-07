package main

import (
	"fmt"
	"strings"
)

// DefaultCapCharacters is how much of a part's output the agent sees uncapped, as version 4's command output cap.
const DefaultCapCharacters = 400

// ReadCapCharacters bounds the output returned directly by commands that only read.
const ReadCapCharacters = 16000

// DefaultMostOutputBytes is how much of one part's output stays on disk when the journal names no limit, as for the
// runs a worker's proof or a trigger starts.
const DefaultMostOutputBytes = 100 << 20

// Shown is what the agent sees of a part's output: all of it up to the cap, or uncapped when the cap is lifted for a
// line of journal commands; past the cap, the tail that fits half the cap, from the start of a line, and one line
// naming the output and the flag that reads what was cut.
func Shown(text string, size OutputSize, process, capCharacters int, uncapped bool, readFlag string) string {
	if uncapped || len(text) <= capCharacters {
		return text
	}
	return tail(text, capCharacters/2) + fmt.Sprintf("output %d is %d lines, %d characters: journal output read %d %s\n", process, size.Lines, size.Bytes, process, readFlag)
}

func tail(text string, characters int) string {
	kept := text[len(text)-characters:]
	if cut := strings.Index(kept, "\n"); cut >= 0 && cut < len(kept)-1 {
		kept = kept[cut+1:]
	}
	if !strings.HasSuffix(kept, "\n") {
		kept += "\n"
	}
	return kept
}
