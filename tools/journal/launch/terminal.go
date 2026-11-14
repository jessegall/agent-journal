// Package launch starts an agent program for the journal: the boot menu that picks its suite, environment,
// conversation and prompts, the worktree a launch works in, and the socket a dispatch hands a worker to.
package launch

import (
	"bufio"
	"errors"
	"io"
	"os"
	"os/exec"
	"strings"
)

// The codes that hide the cursor while the menu is drawn and show it again once the menu is done.
const (
	hideCursor = "\x1b[?25l"
	showCursor = "\x1b[?25h"
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
	KeyEscape
)

// Press is one key a person pressed, with the character it typed.
type Press struct {
	Key  Key
	Rune rune
}

// ErrNoInput is the error a terminal gives once no key is left to read.
var ErrNoInput = errors.New("the terminal has no more input")

// Terminal reads the keys a person presses, draws the menu's text and says how that text should look.
type Terminal interface {
	Read() (Press, error)
	Draw(text string)
	Style() Style
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
		_, _ = io.WriteString(terminal.writer, showCursor)
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
		return Press{Key: KeyEscape}, nil
	case 27:
		return terminal.escape()
	}
	return Press{Key: KeyRune, Rune: character}, nil
}

// escape reads what follows an escape byte: an arrow key's sequence, or nothing when the person pressed Escape alone.
func (terminal *ConsoleTerminal) escape() (Press, error) {
	if terminal.reader.Buffered() == 0 {
		return Press{Key: KeyEscape}, nil
	}
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

// Style is colour when the output is a terminal that shows it and the person has not turned it off with NO_COLOR.
func (terminal *ConsoleTerminal) Style() Style {
	shown := isTerminal(os.Stdout) && os.Getenv("TERM") != "dumb" && os.Getenv("NO_COLOR") == ""
	return Style{Colour: shown, Columns: terminalColumns()}
}

// Draw puts the text at the top of the screen, each line cleared to its end and the rest of the screen cleared below it, so
// a redraw does not flicker.
func (terminal *ConsoleTerminal) Draw(text string) {
	_, _ = io.WriteString(terminal.writer, hideCursor+"\x1b[H"+strings.ReplaceAll(text, "\r\n", "\x1b[K\r\n")+"\x1b[K\x1b[J")
}

// isTerminal says whether the file is a terminal: a character device.
func isTerminal(file *os.File) bool {
	status, err := file.Stat()
	return err == nil && status.Mode()&os.ModeCharDevice != 0
}
