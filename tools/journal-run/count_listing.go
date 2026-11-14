package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strconv"
	"syscall"
	"time"
)

const listingKillGraceMilliseconds = 1000

// ListingOptions configures the listing helper, including short limits used by its tests.
type ListingOptions struct {
	Program               string
	Shell                 string
	LimitSeconds          int
	KillGraceMilliseconds int
}

func listingOptions(values []ListingOptions) ListingOptions {
	var options ListingOptions
	if len(values) > 0 {
		options = values[0]
	}
	if options.Program == "" {
		options.Program = os.Args[0]
	}
	if options.Shell == "" {
		options.Shell = "/bin/sh"
	}
	if options.LimitSeconds <= 0 {
		options.LimitSeconds = CountLimitSeconds
	}
	if options.KillGraceMilliseconds <= 0 {
		options.KillGraceMilliseconds = listingKillGraceMilliseconds
	}
	return options
}

func countListingMain(arguments []string) int {
	if len(arguments) != 5 {
		fmt.Fprintln(os.Stderr, "test listing needs its folder, shell, limits and command")
		return 2
	}
	limitSeconds, err := strconv.Atoi(arguments[2])
	if err != nil || limitSeconds <= 0 {
		fmt.Fprintln(os.Stderr, "test listing limit must be positive")
		return 2
	}
	graceMilliseconds, err := strconv.Atoi(arguments[3])
	if err != nil || graceMilliseconds <= 0 {
		fmt.Fprintln(os.Stderr, "test listing termination grace must be positive")
		return 2
	}
	options := ListingOptions{Shell: arguments[1], LimitSeconds: limitSeconds, KillGraceMilliseconds: graceMilliseconds}
	code := runListing(arguments[0], arguments[4], options)
	if err := os.WriteFile(filepath.Join(arguments[0], "counted"), []byte(strconv.Itoa(code)), 0644); err != nil {
		fmt.Fprintln(os.Stderr, "test listing result could not be recorded:", err)
		return 1
	}
	return 0
}

func runListing(folder, line string, options ListingOptions) int {
	output, err := os.OpenFile(filepath.Join(folder, "count.out"), os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Fprintln(os.Stderr, "test listing output could not be opened:", err)
		return 125
	}
	defer output.Close()
	interrupted, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
	defer stop()
	ctx, cancel := context.WithTimeout(interrupted, time.Duration(options.LimitSeconds)*time.Second)
	defer cancel()
	command := exec.Command(options.Shell, "-c", line)
	command.Stdout, command.Stderr = output, output
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := command.Start(); err != nil {
		fmt.Fprintln(output, "test listing could not start:", err)
		return 127
	}
	defer syscall.Kill(-command.Process.Pid, syscall.SIGKILL)
	waited := make(chan error, 1)
	go func() { waited <- command.Wait() }()
	select {
	case err := <-waited:
		if err == nil {
			return 0
		}
		if exit, ok := err.(*exec.ExitError); ok && exit.ExitCode() > 0 {
			return exit.ExitCode()
		}
		return 1
	case <-ctx.Done():
		fmt.Fprintln(output, "test listing stopped before completion; test count is unknown")
		return stopListing(command, waited, time.Duration(options.KillGraceMilliseconds)*time.Millisecond, output)
	}
}

func stopListing(command *exec.Cmd, waited <-chan error, grace time.Duration, output io.Writer) int {
	_ = syscall.Kill(-command.Process.Pid, syscall.SIGTERM)
	select {
	case <-waited:
		return 124
	case <-time.After(grace):
	}
	_ = syscall.Kill(-command.Process.Pid, syscall.SIGKILL)
	select {
	case <-waited:
	case <-time.After(time.Second):
		fmt.Fprintln(output, "test listing did not exit after KILL")
	}
	return 124
}
