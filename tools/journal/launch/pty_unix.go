//go:build darwin || linux

package launch

import (
	"io"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"
	"unsafe"
)

// windowSize is the size the kernel keeps for a terminal, in rows and columns.
type windowSize struct {
	rows, columns, width, height uint16
}

func ioctl(file *os.File, request uintptr, argument uintptr) error {
	if _, _, errno := syscall.Syscall(syscall.SYS_IOCTL, file.Fd(), request, argument); errno != 0 {
		return errno
	}
	return nil
}

// RunInTerminal runs the program in a pseudo terminal of its own: what the person types goes to it, and what it
// prints goes to the person's screen and to the log alike. It calls started once the program has started, and returns
// when the program ends.
func RunInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer, started func()) error {
	wait, err := StartInTerminal(command, input, screen, log)
	if err != nil {
		return err
	}
	started()
	return wait()
}

// RunBelowBand is RunInTerminal with the band on the top row of the person's terminal: the program has one row less and
// prints on the screen through the band.
func RunBelowBand(band *Band, command *exec.Cmd, input io.Reader, log io.Writer, started func()) error {
	defer band.End()
	wait, err := startIn(band, command, input, band, log)
	if err != nil {
		return err
	}
	started()
	return wait()
}

// outputDrainWait is how long an ended program's last output is read for. A process it left behind can hold the terminal
// open for good, and that must not keep the launch from seeing the program's end.
const outputDrainWait = time.Second

// StartInTerminal starts the terminal program and returns the function that copies its output and waits for it.
func StartInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer) (func() error, error) {
	return startIn(nil, command, input, screen, log)
}

func startIn(band *Band, command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer) (func() error, error) {
	controller, terminal, err := openTerminal()
	if err != nil {
		return nil, err
	}
	copySize(os.Stdin, controller, band)
	command.Stdin, command.Stdout, command.Stderr = terminal, terminal, terminal
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true, Setctty: true}
	if err := command.Start(); err != nil {
		terminal.Close()
		controller.Close()
		return nil, err
	}
	terminal.Close()
	return func() error {
		defer controller.Close()
		resizes := make(chan os.Signal, 1)
		signal.Notify(resizes, syscall.SIGWINCH)
		defer func() {
			signal.Stop(resizes)
			close(resizes)
		}()
		go func() {
			for range resizes {
				copySize(os.Stdin, controller, band)
			}
		}()
		go func() { _, _ = io.Copy(controller, input) }()
		copied := make(chan struct{})
		go func() {
			_, _ = io.Copy(io.MultiWriter(screen, log), controller)
			close(copied)
		}()
		err := command.Wait()
		select {
		case <-copied:
		case <-time.After(outputDrainWait):
		}
		return err
	}, nil
}

// copySize gives the program's terminal the size of the person's, less the band's row when there is a band, which is then
// drawn again for the new size.
func copySize(source *os.File, target *os.File, band *Band) {
	var size windowSize
	if ioctl(source, syscall.TIOCGWINSZ, uintptr(unsafe.Pointer(&size))) != nil {
		return
	}
	if band != nil {
		band.Begin(int(size.rows), int(size.columns))
		size.rows = uint16(band.AgentRows())
	}
	_ = ioctl(target, syscall.TIOCSWINSZ, uintptr(unsafe.Pointer(&size)))
}

// terminalColumns is how wide the person's terminal is, or 0 when it cannot say.
func terminalColumns() int {
	var size windowSize
	if ioctl(os.Stdout, syscall.TIOCGWINSZ, uintptr(unsafe.Pointer(&size))) != nil {
		return 0
	}
	return int(size.columns)
}
