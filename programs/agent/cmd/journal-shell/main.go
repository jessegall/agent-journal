// Command journal-shell is the shell a protected-account container gives Claude Code (CLAUDE_CODE_SHELL, installed as
// /opt/journal/shell/bash, since Claude Code takes a shell only by that name). It parses nothing: the command string
// of each `bash -c` call goes, as it came, to the executor, which runs it as the tools user in the workspace, so no
// expansion, redirection or startup script ever runs as the program's user. Streams, the terminal size, signals and
// the exit code pass through as if bash had run it here.
package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"golang.org/x/term"

	"journal-agent/executor"
	"journal-agent/shellbridge"
)

// forwarded are the signals the command's group receives as the bridge does, by the executor's names.
var forwarded = map[os.Signal]string{
	syscall.SIGINT: "INT", syscall.SIGTERM: "TERM", syscall.SIGHUP: "HUP", syscall.SIGQUIT: "QUIT",
}

// signalNumbers turn the signal that ended the command into a shell's exit code, 128 plus its number.
var signalNumbers = map[string]int{"INT": 2, "QUIT": 3, "KILL": 9, "TERM": 15, "HUP": 1}

func main() {
	os.Exit(run())
}

func run() int {
	command, err := shellbridge.CommandOf(os.Args[1:])
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-shell:", err)

		return 2
	}

	folder, err := os.Getwd()
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-shell: the working folder is unknown:", err)

		return 2
	}

	request := executor.Request{Command: command, Cwd: folder}
	input := int(os.Stdin.Fd())
	if term.IsTerminal(input) {
		request.Tty = true
		request.Cols, request.Rows = terminalSize(input)
		if state, err := term.MakeRaw(input); err == nil {
			defer func() { _ = term.Restore(input, state) }()
		}
	}

	ctx := context.Background()
	client, err := executor.Dial(ctx, executor.SocketPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-shell: the executor cannot be reached:", err)

		return 126
	}

	signals, resizes := relay(input, request.Tty)
	exit, err := client.Run(ctx, request, executor.Streams{
		Stdin: os.Stdin, Stdout: os.Stdout, Stderr: os.Stderr, Signals: signals, Resizes: resizes,
	})
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-shell:", err)

		return 126
	}

	if exit.Signal != "" {
		return 128 + signalNumbers[exit.Signal]
	}

	return exit.Code
}

// relay passes each forwarded signal on by name, and each change of the terminal's size when there is a terminal.
func relay(input int, tty bool) (<-chan string, <-chan [2]uint16) {
	caught := make(chan os.Signal, 8)
	watched := []os.Signal{syscall.SIGINT, syscall.SIGTERM, syscall.SIGHUP, syscall.SIGQUIT}
	if tty {
		watched = append(watched, syscall.SIGWINCH)
	}
	signal.Notify(caught, watched...)

	signals := make(chan string, 8)
	resizes := make(chan [2]uint16, 8)
	go func() {
		for received := range caught {
			if received == syscall.SIGWINCH {
				cols, rows := terminalSize(input)
				resizes <- [2]uint16{rows, cols}

				continue
			}

			signals <- forwarded[received]
		}
	}()

	return signals, resizes
}

// terminalSize is the terminal's columns and rows, or 80 by 24 when they cannot be read.
func terminalSize(input int) (uint16, uint16) {
	cols, rows, err := term.GetSize(input)
	if err != nil {
		return 80, 24
	}

	return uint16(cols), uint16(rows)
}
