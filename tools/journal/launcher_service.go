package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/jessegall/agent-journal/tools/journal/launch"
	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// RunLauncherService serves new programs while earlier launches finish with their existing terminals.
func RunLauncherService(home string, stderr io.Writer) int {
	binary := filepath.Join(home, "bin", "journal")
	version, err := launch.ReadBinaryVersion(binary)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	inputs := launch.NewTerminalInputs()
	journal := launchJournal()
	starter := launch.ProcessStarter{Home: home, Inputs: inputs, OnAnswer: journal.TellMenuAnswer, OnExit: programExitReporter(journal, inputs)}
	listener, err := replacementListener(home, version.Digest, starter, inputs)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	if listener == nil {
		return SuccessCode
	}
	defer listener.Close()
	stop := make(chan struct{})
	defer close(stop)
	go watchLauncher(home, binary, version, stop, stderr)
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()
	for range ticker.C {
		if !listener.HasPrograms() {
			return SuccessCode
		}
	}
	return SuccessCode
}

// ReplaceLauncher lets an install update a launcher that predates executable watching.
func ReplaceLauncher(home string, stderr io.Writer) int {
	path := socket.NamedPath(home, "launcher")
	if _, err := launch.LauncherVersion(path); err != nil {
		return SuccessCode
	}
	binary := filepath.Join(home, "bin", "journal")
	version, err := launch.ReadBinaryVersion(binary)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	if err := launch.EnsureReplacement(path, version.Digest, func() error { return startLauncherService(home, binary) }); err != nil {
		fmt.Fprintln(stderr, err)
		return ErrorCode
	}
	return SuccessCode
}

func replacementListener(home, version string, starter launch.Starter, inputs *launch.TerminalInputs) (*launch.Listener, error) {
	unlock, err := lockLauncherReplacement(filepath.Join(home, "launcher-replace.lock"))
	if err != nil {
		return nil, err
	}
	defer unlock()
	path := socket.NamedPath(home, "launcher")
	served, err := launch.LauncherVersion(path)
	if err != nil || served == version {
		return nil, nil
	}
	return launch.ListenVersioned(path, starter, inputs, version)
}

func watchLauncher(home, binary string, version launch.BinaryVersion, stop <-chan struct{}, stderr io.Writer) {
	launch.WatchBinary(stop, binary, socket.NamedPath(home, "launcher"), version,
		func() error { return startLauncherService(home, binary) },
		func(err error) { fmt.Fprintln(stderr, "the launcher update will retry:", err) })
}

func startLauncherService(home, binary string) error {
	log, err := os.OpenFile(filepath.Join(home, "launcher.log"), os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	defer log.Close()
	command := exec.Command(binary, "launcher-service")
	command.Env = append(os.Environ(), "JOURNAL_HOME="+home)
	command.Stdout, command.Stderr = log, log
	command.SysProcAttr = DetachedProcess()
	if err := command.Start(); err != nil {
		return err
	}
	go func() { _ = command.Wait() }()
	return nil
}
