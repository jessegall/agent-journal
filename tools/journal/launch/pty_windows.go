package launch

import (
	"errors"
	"io"
	"os/exec"
)

// RunInTerminal is not there on Windows, which has no pseudo terminal of this kind.
func RunInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer) error {
	_, err := StartInTerminal(command, input, screen, log)
	return err
}

// StartInTerminal cannot start a pseudo terminal on Windows.
func StartInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer) (func() error, error) {
	return nil, errors.New("journal launch runs agent programs in a pseudo terminal, which Windows does not have")
}
