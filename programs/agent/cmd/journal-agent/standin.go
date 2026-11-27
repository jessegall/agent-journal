//go:build standin

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

	"journal-agent/dockerstandin"
	"journal-agent/recording"

	"golang.org/x/term"
)

func init() {
	developmentCommands["standin"] = standin
}

// standinPause is the longest a stand-in waits between two recorded chunks of output, so a recording plays quickly.
const standinPause = 20 * time.Millisecond

// keysPrompt is what the key recorder draws first, so a test sees it is ready.
const keysPrompt = "keys> "

// crashLine is the typed line that makes the recording stand-in exit 1, as a crash.
const crashLine = "crash"

// errCrashed is the stand-in's crash, asked for by its typed input.
var errCrashed = errors.New("crash typed")

// standin runs a stand-in for a dependency the suite must not reach for real: "standin docker --socket <path>"
// serves the Docker stand-in daemon on that socket, its containers running the echo program, until stopped;
// "standin recording --recording <folder> --started <file> --transcript <file> -- <arguments>" plays a terminal
// recording in place of the program it was recorded from; "standin keys --record <file>" writes every byte typed on its
// terminal into the file and draws the typed text on its screen; "standin exchange --recording <folder>" answers what
// is written to it on pipes as the recorded program did.
func standin(arguments []string) error {
	if len(arguments) > 0 && arguments[0] == "docker" {
		return standinDocker(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "recording" {
		return standinRecording(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "keys" {
		return standinKeys(arguments[1:])
	}
	if len(arguments) > 0 && arguments[0] == "exchange" {
		return standinExchange(arguments[1:])
	}

	return errors.New("usage: journal-agent standin docker --socket <path> --image <reference>... | standin recording ...")
}

func standinDocker(arguments []string) error {
	flags := flag.NewFlagSet("standin docker", flag.ContinueOnError)
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
	programs := func(*dockerstandin.Container) dockerstandin.Program { return dockerstandin.EchoProgram }
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
		programs = programInContainer(standinProgram{*program, version, signIn}, replayProgram(fixture))
	}
	daemon := dockerstandin.Serve(listener, *image)
	daemon.Programs = func(container *dockerstandin.Container) dockerstandin.Program {
		if *started != "" {
			_ = noteContainer(*started, container)
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

// standinRecording stands in for a program on a terminal: it notes the arguments it was started with, plays the
// recording by what is typed, writes the transcript file once a prompt is sent, so a resume finds it, and exits 1
// when crash is typed.
func standinRecording(arguments []string) error {
	flags := flag.NewFlagSet("standin recording", flag.ContinueOnError)
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

	err = recording.GatedReplay(fixture, os.Stdin, os.Stdout, standinPause, heard)
	if errors.Is(err, errCrashed) {
		_ = term.Restore(int(os.Stdin.Fd()), previous)
		os.Exit(1)
	}

	return err
}

// standinExchange stands in for a program on pipes: it answers what is written to it as the recorded program did,
// with this environment's values, and exits as the recording did. While the hold file exists, a line of the held method
// waits, and a recording with no input waits after its first lines; a line of the released method waits until its
// file exists, as a sign-in waits for the user who completes it.
func standinExchange(arguments []string) error {
	flags := flag.NewFlagSet("standin exchange", flag.ContinueOnError)
	var folders recordingFolders
	flags.Var(&folders, "recording", "a folder of an exchange recording to play; repeat it to answer from several")
	holdFile := flags.String("hold", "", "the file whose existence holds the answer")
	held := flags.String("hold-before", "", "the method whose lines wait while the hold file exists")
	released := flags.String("release-before", "", "a method and a file, as method=file: its lines wait until the file exists")
	heardFile := flags.String("heard", "", "the file each line written to the program is added to")
	holdAfter := flags.Int("hold-after-lines", -1, "for a recording with no input, the lines played before it holds")
	endsAfterLast := flags.Bool("ends-after-last", false, "end once the recording's last written line is answered")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	fixtures := make([]recording.Fixture, 0, len(folders))
	for _, folder := range folders {
		fixture, err := recording.Load(folder)
		if err != nil {
			return err
		}
		fixtures = append(fixtures, fixture)
	}
	if len(fixtures) == 0 {
		return errors.New("standin exchange plays at least one --recording")
	}
	hold := func() {
		for *holdFile != "" && isPresent(*holdFile) {
			time.Sleep(standinPause)
		}
	}
	releasedMethod, releaseFile, _ := strings.Cut(*released, "=")
	holdBefore := func(method string) {
		for method == releasedMethod && releaseFile != "" && !isPresent(releaseFile) {
			time.Sleep(standinPause)
		}
		if method == *held {
			hold()
		}
	}
	heard := func(line string) {
		if *heardFile != "" {
			_ = appendLine(*heardFile, line)
		}
	}
	err := recording.ExchangeReplay(fixtures, os.Stdin, os.Stdout, os.Stderr, os.Getenv, heard, holdBefore, *holdAfter, hold, *endsAfterLast)
	if err != nil {
		return err
	}
	os.Exit(fixtures[0].ExitCode)
	return nil
}

// recordingFolders are the recordings a flag repeated names, in order.
type recordingFolders []string

func (folders *recordingFolders) String() string { return strings.Join(*folders, ",") }

func (folders *recordingFolders) Set(folder string) error {
	*folders = append(*folders, folder)
	return nil
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

// standinKeys records what reaches its terminal byte for byte, its terminal raw so nothing is changed on the way, and
// draws the typed text, so a test compares what was sent, what arrived and what the screen showed.
func standinKeys(arguments []string) error {
	flags := flag.NewFlagSet("standin keys", flag.ContinueOnError)
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

// standinProgram is what a session's container runs in place of its program: its name, what it prints for its
// version and for its sign-in.
type standinProgram struct {
	name            string
	version, signIn recording.Fixture
}

// programInContainer answers a container as the program would in it: its version and its sign-in as recorded, with
// the container's own environment, and on a terminal the session's recording; a container that does not run it, such as a throwaway, ends at once.
func programInContainer(program standinProgram, session dockerstandin.Program) func(*dockerstandin.Container) dockerstandin.Program {
	return func(container *dockerstandin.Container) dockerstandin.Program {
		// A container runs its entrypoint with its command as arguments, so the program may be named in either.
		arguments, found := argumentsAfter(slices.Concat(container.Config.Entrypoint, container.Config.Cmd), program.name)
		switch {
		case !found:
			return nil
		case slices.Contains(arguments, "--version"):
			return dockerstandin.Printing(program.version.Printed(variablesOf(container.Config.Env)), program.version.ExitCode)
		case len(arguments) > 0 && arguments[0] == "auth":
			return dockerstandin.Printing(program.signIn.Printed(variablesOf(container.Config.Env)), program.signIn.ExitCode)
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

// argumentsAfter are the arguments after the program in an argv, past any launcher before it.
func argumentsAfter(argv []string, program string) ([]string, bool) {
	for index, argument := range argv {
		if filepath.Base(argument) == program {
			return argv[index+1:], true
		}
	}
	return nil, false
}

// replayProgram plays the recording in a session's container by what is typed into it, as its program would.
func replayProgram(fixture recording.Fixture) dockerstandin.Program {
	return func(_ context.Context, _ *dockerstandin.Container, input io.Reader, output io.Writer) int {
		if err := recording.GatedReplay(fixture, input, output, standinPause, func(recording.Typed) error { return nil }); err != nil {
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

func noteContainer(file string, container *dockerstandin.Container) error {
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
