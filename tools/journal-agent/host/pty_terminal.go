package host

import (
	"os"

	"github.com/creack/pty"
)

// TerminalStream is the terminal of a program the host runs or attaches to: what the program prints is read from
// it, what is typed is written to it, and it has the size of the window that shows it. Closing it hangs up.
type TerminalStream interface {
	Read(buffer []byte) (int, error)
	Write(typed []byte) (int, error)
	Close() error
	Resize(rows, columns uint16) error
	Size() (rows, columns uint16, err error)
}

// ptyTerminal is the terminal of a program the host runs itself as a child, on a PTY the host owns.
type ptyTerminal struct {
	*os.File
}

// PtyTerminal is the terminal of a child the host started on the PTY given.
func PtyTerminal(file *os.File) TerminalStream {
	return ptyTerminal{file}
}

func (terminal ptyTerminal) Resize(rows, columns uint16) error {
	return pty.Setsize(terminal.File, &pty.Winsize{Rows: rows, Cols: columns})
}

func (terminal ptyTerminal) Size() (uint16, uint16, error) {
	size, err := pty.GetsizeFull(terminal.File)
	if err != nil {
		return 0, 0, err
	}

	return size.Rows, size.Cols, nil
}
