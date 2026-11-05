//go:build darwin || linux

package launch

import (
	"io"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
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
// prints goes to the person's screen and to the log alike. It returns when the program ends.
func RunInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer) error {
	wait, err := StartInTerminal(command, input, screen, log)
	if err != nil {
		return err
	}
	return wait()
}

// StartInTerminal starts the terminal program and returns the function that copies its output and waits for it.
func StartInTerminal(command *exec.Cmd, input io.Reader, screen io.Writer, log io.Writer) (func() error, error) {
	controller, terminal, err := openTerminal()
	if err != nil {
		return nil, err
	}
	copySize(os.Stdin, controller)
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
				copySize(os.Stdin, controller)
			}
		}()
		go func() { _, _ = io.Copy(controller, input) }()
		_, _ = io.Copy(io.MultiWriter(screen, log), controller)
		return command.Wait()
	}, nil
}

func copySize(source *os.File, target *os.File) {
	var size windowSize
	if ioctl(source, syscall.TIOCGWINSZ, uintptr(unsafe.Pointer(&size))) == nil {
		_ = ioctl(target, syscall.TIOCSWINSZ, uintptr(unsafe.Pointer(&size)))
	}
}
