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
	"strconv"
	"strings"
	"syscall"
	"time"

	"journal-runner/dockermock"
	"journal-runner/recording"

	"golang.org/x/term"
)

func init() {
	developmentCommands["mock"] = mock
}

// mockPause is the longest a mock waits between two recorded chunks of output, so a recording plays quickly.
const mockPause = 20 * time.Millisecond

// keysPrompt is what the key recorder draws first, so a test sees it is ready.
const keysPrompt = "keys> "

// crashLine is the typed line that makes the recording mock exit 1, as a crash.
const crashLine = "crash"

// errCrashed is the mock's crash, asked for by its typed input.
var errCrashed = errors.New("crash typed")

// mock runs a mock for a dependency the suite must not reach for real: "mock docker --socket <path>"
// serves the Docker mock daemon on that socket, its containers running the echo program, until stopped;
// "mock recording --recording <folder> --started <file> --transcript <file> -- <arguments>" plays a terminal
// recording in place of the program it was recorded from; "mock keys --record <file>" writes every byte typed on its
// terminal into the file and draws the typed text on its screen; "mock script --script <file>" answers what is
// written to it on pipes as the test's script says, in order; "mock print --recording <folder>" prints what a
// recorded program printed and exits as it did; "mock scenario --scenario <driver>/<name> -- <arguments>" plays the
// driver program of a recorded scenario with its hooks run as the start's settings configure them.
func mock(arguments []string) error {
	if len(arguments) > 0 && arguments[0] == "docker" {
		return mockDocker(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "recording" {
		return mockRecording(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "keys" {
		return mockKeys(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "script" {
		return mockScript(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "print" {
		return mockPrint(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "scenario" {
		return mockScenario(arguments[1:])
	}

	return errors.New("usage: journal-runner mock docker --socket <path> --image <reference>... | mock recording ...")
}

func mockDocker(arguments []string) error {
	flags := flag.NewFlagSet("mock docker", flag.ContinueOnError)
	socket := flags.String("socket", "", "the Unix socket the daemon listens on")
	image := flags.String("image", "", "an image the daemon holds, by digest")
	untilInputEnds := flags.Bool("until-input-ends", false, "stop once standard input ends")
	sessionRecording := flags.String("recording", "", "the terminal recording a session's container plays; echo without one")
	program := flags.String("executable", "", "the executable a session's container runs, by its name")
	versionRecording := flags.String("version-recording", "", "the exchange recording of what the program prints for --version")
	signInRecording := flags.String("sign-in-recording", "", "the exchange recording of what the program prints for auth")
	started := flags.String("containers", "", "the file each started container's shape is added to, one JSON object a line")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	listener, err := net.Listen("unix", *socket)
	if err != nil {
		return err
	}
	programs := func(*dockermock.Container) dockermock.Program { return dockermock.EchoProgram }
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
	daemon := dockermock.Serve(listener, *image)
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

// mockRecording stands in for a program on a terminal: it notes the arguments it was started with, plays the
// recording by what is typed, writes the transcript file once a prompt is sent, so a resume finds it, and exits 1
// when crash is typed.
func mockRecording(arguments []string) error {
	flags := flag.NewFlagSet("mock recording", flag.ContinueOnError)
	folder := flags.String("recording", "", "the folder of the terminal recording to play")
	started := flags.String("started", "", "the file each start's arguments are added to, one JSON list a line")
	transcript := flags.String("transcript", "", "the file written once a prompt is sent")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if err := noteStart(*started, flags.Args()); err != nil {
		return err
	}
	fixture, err := recording.Load(*folder)
	if err != nil {
		return err
	}
	// Raw, as the program it stands in for: the terminal echoes nothing and hands each key on as it was typed.
	previous, err := term.MakeRaw(int(os.Stdin.Fd()))
	if err != nil {
		return err
	}
	defer func() { _ = term.Restore(int(os.Stdin.Fd()), previous) }()
	hasText := false
	heard := func(piece recording.Typed) error {
		if piece.Type == recording.TypedText && strings.TrimSpace(string(piece.Bytes)) == crashLine {
			return errCrashed
		}
		if piece.Type == recording.TypedKey && string(piece.Bytes) == "\r" && hasText {
			return writeTranscript(*transcript)
		}
		hasText = hasText || piece.Type == recording.TypedText
		return nil
	}

	err = recording.GatedReplay(fixture, os.Stdin, os.Stdout, mockPause, heard)
	if errors.Is(err, errCrashed) {
		_ = term.Restore(int(os.Stdin.Fd()), previous)
		os.Exit(1)
	}

	return err
}

// mockScript answers a program on pipes as the test's script says, in order, carrying on where an earlier start of
// it left off; a line the script did not expect, or a missing script, is written to the failures file for the test
// and ends the mock with exit code 1. The heard file gets each line written to it.
func mockScript(arguments []string) error {
	flags := flag.NewFlagSet("mock script", flag.ContinueOnError)
	scriptFile := flags.String("script", "", "the script the test wrote, as JSON")
	failures := flags.String("failures", "", "the file a line the script did not expect is added to")
	heardFile := flags.String("heard", "", "the file each line written to the program is added to")
	stepsRan := flags.String("steps-ran", "", "the folder a file of each test step that ran appears in")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	place := scriptPlace{played: *scriptFile + ".played", failures: *failures, stepsRan: *stepsRan}
	script, err := readScript(*scriptFile)
	if err != nil {
		place.Failed(recording.ScriptFailure{Program: filepath.Base(*scriptFile), Expected: "a script", Got: err.Error()})
		os.Exit(1)
	}
	heard := func(line string) {
		if *heardFile != "" {
			_ = appendLine(*heardFile, line)
		}
		// A thread or turn written without its model or effort would run at the driver's own default.
		if method, isMissing := withoutModelOrEffort(line); isMissing {
			place.Failed(recording.ScriptFailure{Program: filepath.Base(*scriptFile),
				Expected: method + " with a model and an effort", Got: line})
			os.Exit(1)
		}
	}
	if err := recording.ScriptReplay(script, place, os.Stdin, os.Stdout, os.Stderr, os.Getenv, heard); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	os.Exit(script.ExitCode)
	return nil
}

// withoutModelOrEffort answers the method of an app-server line that starts a thread without a model, or a turn
// without a model or an effort.
func withoutModelOrEffort(line string) (string, bool) {
	var written struct {
		Method string `json:"method"`
		Params struct {
			Model  string `json:"model"`
			Effort string `json:"effort"`
		} `json:"params"`
	}
	if json.Unmarshal([]byte(line), &written) != nil {
		return "", false
	}
	switch written.Method {
	case "thread/start":
		return written.Method, written.Params.Model == ""
	case "turn/start":
		return written.Method, written.Params.Model == "" || written.Params.Effort == ""
	}
	return "", false
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

func readScript(path string) (recording.Script, error) {
	var script recording.Script
	read, err := os.ReadFile(path)
	if err != nil {
		return script, fmt.Errorf("no mock script at %s: give the mock one with mocks()", path)
	}
	return script, json.Unmarshal(read, &script)
}

// scriptPlace keeps a script's place in files the test reads: how many steps were answered, the test's steps that
// ran and each failure.
type scriptPlace struct {
	played, failures, stepsRan string
}

func (place scriptPlace) Played() int {
	read, err := os.ReadFile(place.played)
	if err != nil {
		return 0
	}
	count, err := strconv.Atoi(strings.TrimSpace(string(read)))
	if err != nil {
		return 0
	}
	return count
}

func (place scriptPlace) Answered(count int) {
	_ = os.WriteFile(place.played, []byte(strconv.Itoa(count)+"\n"), 0o600)
}

func (place scriptPlace) HasRun(step string) bool {
	return place.stepsRan != "" && isPresent(filepath.Join(place.stepsRan, step))
}

func (place scriptPlace) Story() string {
	read, err := os.ReadFile(filepath.Join(place.stepsRan, "current"))
	if err != nil {
		return "its start"
	}
	return strings.TrimSpace(string(read))
}

func (place scriptPlace) Failed(failure recording.ScriptFailure) {
	line, err := json.Marshal(failure)
	if err == nil && place.failures != "" {
		_ = appendLine(place.failures, string(line))
	}
	fmt.Fprintf(os.Stderr, "mock %s: expected %s, heard %s\n", failure.Program, failure.Expected, failure.Got)
}

// appendLine adds the line to the file, made when missing.
func appendLine(path, line string) error {
	opened, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	defer opened.Close()
	_, err = fmt.Fprintln(opened, line)
	return err
}

func isPresent(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

// mockKeys records what reaches its terminal byte for byte, its terminal raw so nothing is changed on the way, and
// draws the typed text, so a test compares what was sent, what arrived and what the screen showed.
func mockKeys(arguments []string) error {
	flags := flag.NewFlagSet("mock keys", flag.ContinueOnError)
	file := flags.String("record", "", "the file every byte read is written to")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	record, err := os.OpenFile(*file, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	defer record.Close()
	previous, err := term.MakeRaw(int(os.Stdin.Fd()))
	if err != nil {
		return err
	}
	defer func() { _ = term.Restore(int(os.Stdin.Fd()), previous) }()
	if _, err := os.Stdout.WriteString(keysPrompt); err != nil {
		return err
	}

	return recording.RecordKeys(os.Stdin, record, os.Stdout)
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
	return appendLine(file, string(line))
}

func noteStart(file string, arguments []string) error {
	line, err := json.Marshal(arguments)
	if err != nil {
		return err
	}
	return appendLine(file, string(line))
}

func writeTranscript(path string) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	return os.WriteFile(path, []byte(`{"type":"user"}`+"\n"), 0o600)
}
