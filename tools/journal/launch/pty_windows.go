package launch

import (
	"errors"
	"io"
	"os/exec"
)

// RunInTerminal is not there on Windows, which has no pseudo terminal of this kind.
func RunInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer, started func()) error {
	_, err := StartInTerminal(command, input, screen, log)
	return err
}

// StartInTerminal cannot start a pseudo terminal on Windows.
func StartInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer) (func() error, error) {
	return nil, errors.New("journal launch runs agent programs in a pseudo terminal, which Windows does not have")
}

// RunBelowBand cannot run a program in a pseudo terminal on Windows.
func RunBelowBand(band *Band, command *exec.Cmd, input io.Reader, log io.Writer, started func()) error {
	_, err := StartInTerminal(command, input, io.Discard, log)
	return err
}

// terminalColumns cannot read the terminal's width on Windows.
func terminalColumns() int { return 0 }
