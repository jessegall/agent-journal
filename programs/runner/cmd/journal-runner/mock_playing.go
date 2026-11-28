//go:build mock

package main

import (
	"context"
	"flag"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"

	"journal-runner/dockermock"
	"journal-runner/recorded"
)

// mockPlaying serves the Docker daemon of a recorded scenario on a socket until stopped: every call gets its recorded
// answer, a session's terminal plays what its program printed, and the calls its program made to the journal are made
// again; each call the recording does not hold is written to the failures file, one line each, for the test to read.
//
//	journal-runner mock playing --scenario <driver>/<name> --socket <path> --failures <file> --typed <file>
func mockPlaying(arguments []string) error {
	flags := flag.NewFlagSet("mock playing", flag.ContinueOnError)
	named := flags.String("scenario", "", "the recorded scenario to play, as <driver>/<name>")
	socket := flags.String("socket", "", "the Unix socket the daemon listens on")
	failuresPath := flags.String("failures", "", "the file each call the recording does not hold is added to")
	typedPath := flags.String("typed", "", "the file each text a played driver program read is added to")
	untilInputEnds := flags.Bool("until-input-ends", false, "stop once standard input ends")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	driver, name, isNamed := strings.Cut(*named, "/")
	if !isNamed {
		return fmt.Errorf("name the scenario as <driver>/<name>, not %q", *named)
	}
	root, err := recorded.Root()
	if err != nil {
		return err
	}
	scenario, err := recorded.Load(root, driver, name)
	if err != nil {
		return err
	}
	failures := &failuresFile{path: *failuresPath}
	playing, err := dockermock.PlayScenario(failures, scenario)
	if err != nil {
		return err
	}
	var typedMutex sync.Mutex
	playing.Typed = func(text []byte) {
		typedMutex.Lock()
		defer typedMutex.Unlock()
		_ = appendLine(*typedPath, strings.ReplaceAll(string(text), "\n", " "))
	}
	listener, err := net.Listen("unix", *socket)
	if err != nil {
		return err
	}
	server := &http.Server{Handler: playing}
	go func() { _ = server.Serve(listener) }()
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if *untilInputEnds {
		stopWhenInputEnds(stop)
	}
	<-ctx.Done()
	// Stopped, the daemon reports every recorded call the host never asked, so a test sees a scenario played short.
	playing.AssertPlayedWhole(failures)
	playing.Close()
	return server.Close()
}

// failuresFile keeps each failure a played daemon reports as a line of a file, as a test reads them.
type failuresFile struct {
	path  string
	mutex sync.Mutex
}

func (failures *failuresFile) Error(values ...any) {
	failures.add(fmt.Sprint(values...))
}

func (failures *failuresFile) Errorf(format string, values ...any) {
	failures.add(fmt.Sprintf(format, values...))
}

func (failures *failuresFile) add(failure string) {
	failures.mutex.Lock()
	defer failures.mutex.Unlock()
	fmt.Fprintln(os.Stderr, "mock playing:", failure)
	_ = appendLine(failures.path, strings.ReplaceAll(failure, "\n", " "))
}
