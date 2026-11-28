//go:build mock

package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"net"
	"os"
	"os/signal"
	"path/filepath"
	"slices"
	"strings"
	"syscall"
	"time"

	"journal-runner/dockermock"
	"journal-runner/recorded"
	"journal-runner/recording"
)

func init() {
	developmentCommands["mock"] = mock
}

// mockPause is the longest a mock waits between two recorded chunks of output, so a recording plays quickly.
const mockPause = 20 * time.Millisecond

// mock runs a mock for a dependency the suite must not reach for real: "mock docker --socket <path>"
// serves the Docker mock daemon on that socket, its containers playing the recorded programs it is given, until stopped;
// "mock print --recording <folder>" prints what a recorded program printed and exits as it did;
// "mock playing --scenario <driver>/<name> --socket <path>" serves the recorded Docker calls of a scenario.
func mock(arguments []string) error {
	if len(arguments) > 0 && arguments[0] == "connect" {
		return mockConnect(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "docker" {
		return mockDocker(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "print" {
		return mockPrint(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "playing" {
		return mockPlaying(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "wire" {
		return mockWire(arguments[1:])
	}

	return errors.New("usage: journal-runner mock docker --socket <path> --image <reference>... | mock print --recording <folder>")
}

func mockDocker(arguments []string) error {
	flags := flag.NewFlagSet("mock docker", flag.ContinueOnError)
	socket := flags.String("socket", "", "the Unix socket the daemon listens on")
	image := flags.String("image", "", "an image the daemon holds, by digest")
	untilInputEnds := flags.Bool("until-input-ends", false, "stop once standard input ends")
	sessionRecording := flags.String("recording", "", "the terminal recording a session's container plays")
	program := flags.String("executable", "", "the executable a session's container runs, by its name")
	versionRecording := flags.String("version-recording", "", "the exchange recording of what the program prints for --version")
	signInRecording := flags.String("sign-in-recording", "", "the exchange recording of what the program prints for auth")
	started := flags.String("containers", "", "the file each started container's shape is added to, one JSON object a line")
	var folders folderList
	flags.Var(&folders, "folder", "a folder the daemon's machine holds, repeated; without one the daemon holds every folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	// Every recording is read before the socket opens, so a bad one ends the mock before a socket nobody serves exists.
	programs := func(*dockermock.Container) dockermock.Program { return nil }
	if *sessionRecording != "" {
		fixture, err := recording.Load(*sessionRecording)
		if err != nil {
			return err
		}
		version, err := recording.Load(*versionRecording)
		if err != nil {
			return err
		}
		signIn, err := recording.Load(*signInRecording)
		if err != nil {
			return err
		}
		programs = programInContainer(mockProgram{*program, version, signIn}, replayProgram(fixture))
	}
	listener, err := net.Listen("unix", *socket)
	if err != nil {
		return err
	}
	daemon := dockermock.Serve(listener, *image)
	daemon.Folders = folders.held()
	daemon.Programs = func(container *dockermock.Container) dockermock.Program {
		if *started != "" {
			_ = noteContainer(*started, container)
		}
		if check := dockermock.RecordedImageCheck(container); check != nil {
			return check
		}
		return programs(container)
	}
	defer daemon.Stop()
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if *untilInputEnds {
		stopWhenInputEnds(stop)
	}
	<-ctx.Done()
	return nil
}

// mockPrint answers a program that only prints, such as its version or its sign-in status, as it was recorded, and
// exits as it did.
func mockPrint(arguments []string) error {
	flags := flag.NewFlagSet("mock print", flag.ContinueOnError)
	folder := flags.String("recording", "", "the folder of the recording to print")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	fixture, err := recording.Load(*folder)
	if err != nil {
		return err
	}
	if err := fixture.PrintAll(os.Stdout, os.Stderr, os.Getenv); err != nil {
		return err
	}
	os.Exit(fixture.ExitCode)
	return nil
}

// mockProgram is what a session's container runs in place of its program: its name, what it prints for its
// version and for its sign-in.
type mockProgram struct {
	name            string
	version, signIn recording.Fixture
}

// programInContainer answers a container as the program would in it: its version and its sign-in as recorded, with
// the container's own environment, and on a terminal the session's recording; a container that does not run it, such as a throwaway, ends at once.
func programInContainer(program mockProgram, session dockermock.Program) func(*dockermock.Container) dockermock.Program {
	return func(container *dockermock.Container) dockermock.Program {
		// A container runs its entrypoint with its command as arguments, so the program may be named in either.
		arguments, found := argumentsAfter(slices.Concat(container.Config.Entrypoint, container.Config.Cmd), program.name)
		switch {
		case !found:
			return nil
		case slices.Contains(arguments, "--version"):
			return dockermock.Printing(program.version.Printed(variablesOf(container.Config.Env)), program.version.ExitCode)
		case len(arguments) > 0 && arguments[0] == "auth":
			return dockermock.Printing(program.signIn.Printed(variablesOf(container.Config.Env)), program.signIn.ExitCode)
		case container.Config.Tty:
			return session
		}
		return nil
	}
}

// variablesOf looks a variable up in a container's environment.
func variablesOf(environment []string) func(string) string {
	return func(name string) string {
		for _, entry := range environment {
			if value, isNamed := strings.CutPrefix(entry, name+"="); isNamed {
				return value
			}
		}
		return ""
	}
}

// argumentsAfter are the arguments after the program in an argv, past any launcher before it, or inside the script of
// a shell that runs it, as a container with a restart command does.
func argumentsAfter(argv []string, program string) ([]string, bool) {
	for index, argument := range argv {
		if filepath.Base(argument) == program {
			return argv[index+1:], true
		}
		if words := scriptWords(argument); len(words) > 1 {
			if arguments, found := argumentsAfter(words, program); found {
				return arguments, true
			}
		}
	}
	return nil, false
}

// scriptWords are the words of a shell script up to its first statement's end, each without its quotes.
func scriptWords(script string) []string {
	words := []string{}
	for _, word := range strings.Fields(script) {
		unquoted := strings.Trim(word, "';")
		words = append(words, unquoted)
		if strings.HasSuffix(word, ";") && len(words) > 1 && words[0] != "if" {
			return words
		}
	}
	return words
}

// replayProgram plays the recording in a session's container by what is typed into it, as its program would.
func replayProgram(fixture recording.Fixture) dockermock.Program {
	return func(_ context.Context, _ *dockermock.Container, input io.Reader, output io.Writer) int {
		if err := recording.GatedReplay(fixture, input, output, mockPause, func(recording.Typed) error { return nil }); err != nil {
			return 1
		}
		return 0
	}
}

// startedContainer is the shape of a started container a test reads back.
type startedContainer struct {
	Name       string            `json:"name"`
	Image      string            `json:"image"`
	User       string            `json:"user"`
	Labels     map[string]string `json:"labels"`
	Entrypoint []string          `json:"entrypoint"`
	Cmd        []string          `json:"cmd"`
	Env        []string          `json:"env"`
	Network    string            `json:"network"`
	Mounts     []startedMount    `json:"mounts"`
}

type startedMount struct {
	Type     string `json:"type"`
	Source   string `json:"source"`
	Target   string `json:"target"`
	ReadOnly bool   `json:"readOnly"`
}

func noteContainer(file string, container *dockermock.Container) error {
	shape := startedContainer{
		Name: container.Name, Image: container.Config.Image, User: container.Config.User, Labels: container.Config.Labels,
		Entrypoint: container.Config.Entrypoint, Cmd: container.Config.Cmd, Env: container.Config.Env,
		Network: string(container.HostConfig.NetworkMode),
	}
	for _, mount := range container.HostConfig.Mounts {
		shape.Mounts = append(shape.Mounts, startedMount{string(mount.Type), mount.Source, mount.Target, mount.ReadOnly})
	}
	line, err := json.Marshal(shape)
	if err != nil {
		return err
	}
	return recorded.AppendLine(file, string(line))
}

// folderList collects the repeated --folder flags.
type folderList []string

func (folders *folderList) String() string { return strings.Join(*folders, ",") }

func (folders *folderList) Set(folder string) error {
	*folders = append(*folders, folder)

	return nil
}

// held is the folders given, or nil when none was, so the daemon holds every folder.
func (folders folderList) held() []string {
	if len(folders) == 0 {
		return nil
	}

	return folders
}
