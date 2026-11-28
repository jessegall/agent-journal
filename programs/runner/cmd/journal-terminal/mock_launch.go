//go:build mock

package main

import (
	"errors"
	"io"
	"os"
	"os/exec"
	"os/signal"
	"syscall"

	"github.com/creack/pty"
)

func launchMockTerminal(arguments []string) error {
	if len(arguments) == 0 {
		return errors.New("name the terminal command to run")
	}
	command := exec.Command(arguments[0], arguments[1:]...)
	tty, err := pty.StartWithSize(command, &pty.Winsize{Rows: 40, Cols: 120})
	if err != nil {
		return err
	}
	defer tty.Close()
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGTERM, syscall.SIGINT)
	defer signal.Stop(signals)
	done := make(chan struct{})
	defer close(done)
	go func() {
		select {
		case caught := <-signals:
			_ = command.Process.Signal(caught)
		case <-done:
		}
	}()
	_, _ = io.Copy(os.Stdout, tty)
	return command.Wait()
}
