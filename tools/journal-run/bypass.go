package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// Bypass runs the line as it is, with no folder and no report, when no server answers, and notes it in the runtime log.
func Bypass(options Options, stdout io.Writer) int {
	note(options)
	command := exec.Command(options.Shell, "-c", options.Line)
	command.Stdout, command.Stderr = stdout, stdout
	if err := command.Run(); err != nil {
		if exit, isExit := err.(*exec.ExitError); isExit {
			return exit.ExitCode()
		}
		return 127
	}
	return 0
}

func note(options Options) {
	folder := filepath.Join(options.Home, "runtime")
	if os.MkdirAll(folder, 0o755) != nil {
		return
	}
	log, err := os.OpenFile(filepath.Join(folder, "bypass.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer log.Close()
	fmt.Fprintf(log, "%s the server did not answer, so process %d ran as it is: %s\n", time.Now().UTC().Format(time.RFC3339), options.Process, options.Line)
}
