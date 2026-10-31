// Package launch starts an agent program for the journal: the boot menu that picks its suite, environment,
// conversation and prompts, the worktree a launch works in, and the socket a dispatch hands a worker to.
package launch

import (
	"bufio"
	"errors"
	"io"
	"os"
	"os/exec"
)

// Key is the kind of key a person pressed in the boot menu.
type Key int

// The keys the boot menu reads.
const (
	KeyRune Key = iota
	KeyEnter
	KeyUp
	KeyDown
	KeyLeft
	KeyBackspace
)

// Press is one key a person pressed, with the character it typed.
type Press struct {
	Key  Key
	Rune rune
}

// ErrNoInput is the error a terminal gives once no key is left to read.
var ErrNoInput = errors.New("the terminal has no more input")

// Terminal reads the keys a person presses and draws the menu's text.
type Terminal interface {
	Read() (Press, error)
	Draw(text string)
}

// ConsoleTerminal is the person's own terminal, put in raw mode while the menu reads it.
type ConsoleTerminal struct {
	reader *bufio.Reader
	writer io.Writer
}

// NewConsoleTerminal reads the process's own input and draws on its output.
func NewConsoleTerminal() *ConsoleTerminal {
	return &ConsoleTerminal{reader: bufio.NewReader(os.Stdin), writer: os.Stdout}
}

// Raw turns the terminal's echo and line buffering off, and gives back the call that turns them on again.
func (terminal *ConsoleTerminal) Raw() func() {
	setting := exec.Command("stty", "raw", "-echo")
	setting.Stdin = os.Stdin
	_ = setting.Run()
	return func() {
		restore := exec.Command("stty", "sane")
		restore.Stdin = os.Stdin
		_ = restore.Run()
	}
}

// Read reads one key, the arrow keys from their escape sequences.
func (terminal *ConsoleTerminal) Read() (Press, error) {
	character, _, err := terminal.reader.ReadRune()
	if err != nil {
		return Press{}, ErrNoInput
	}
	switch character {
	case '\r', '\n':
		return Press{Key: KeyEnter}, nil
	case 127, '\b':
		return Press{Key: KeyBackspace}, nil
	case 3:
		return Press{}, ErrNoInput
	case 27:
		return terminal.escape()
	}
	return Press{Key: KeyRune, Rune: character}, nil
}

func (terminal *ConsoleTerminal) escape() (Press, error) {
	if bracket, _, err := terminal.reader.ReadRune(); err != nil || bracket != '[' {
		return Press{}, ErrNoInput
	}
	code, _, err := terminal.reader.ReadRune()
	if err != nil {
		return Press{}, ErrNoInput
	}
	keys := map[rune]Key{'A': KeyUp, 'B': KeyDown, 'D': KeyLeft}
	if key, mapped := keys[code]; mapped {
		return Press{Key: key}, nil
	}
	return terminal.Read()
}

// Draw clears the screen and draws the text.
func (terminal *ConsoleTerminal) Draw(text string) {
	_, _ = io.WriteString(terminal.writer, "\x1b[2J\x1b[H"+text)
}
