package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// PanicCountStart is how many panic checks the main agent counts down from: each hook that goes through while the panic
// file exists is one check, and at 0 the agent must take up its panic work again before anything else.
const PanicCountStart = 10

func panicCountPath(root string) string {
	return filepath.Join(root, ".journal", "runtime", "panic-count")
}

// NextPanicCount counts one panic check down and says how many are remaining: 10 at the first check, 0 at the eleventh, and
// the count starts over at the one after.
func NextPanicCount(root string) int {
	remaining := PanicCountStart
	if text, err := os.ReadFile(panicCountPath(root)); err == nil {
		if last, err := strconv.Atoi(strings.TrimSpace(string(text))); err == nil && last > 0 {
			remaining = last - 1
		}
	}
	os.WriteFile(panicCountPath(root), []byte(strconv.Itoa(remaining)), 0o644)
	return remaining
}

// ClearPanicCount forgets the count once panic mode is off, so the next panic counts from the start.
func ClearPanicCount(root string) {
	os.Remove(panicCountPath(root))
}

// PanicReply is what a panic check tells the agent: that panic mode is on and how many checks are remaining, and at 0 that it
// must take up its panic work again before anything else. An event that cannot refuse gets the same words as a line.
func PanicReply(program programs.Program, event string, remaining int) Reply {
	if remaining > 0 {
		return Reply{Lines: []string{fmt.Sprintf("[journal] panic mode is on: %d checks left before you must take up your panic work again", remaining)}}
	}
	text := "[journal] panic mode is on: take up your panic work again before anything else, and read the panic file of the journal to see why it began"
	if program.Refusals[event] == "" {
		return Reply{Lines: []string{text}}
	}
	return Reply{Refusal: text}
}

// panicAnswered answers a hook of the main agent that goes around the journal, with the panic countdown in the program's own shape.
func panicAnswered(stdin io.Reader, stdout, stderr io.Writer, program programs.Program, root string) int {
	body, _ := io.ReadAll(stdin)
	name := hookName(body)
	stdoutText, stderrText, code := ProgramAnswer(program, name, program.Events[name], PanicReply(program, program.Events[name], NextPanicCount(root)))
	io.WriteString(stdout, stdoutText)
	io.WriteString(stderr, stderrText)
	return code
}
