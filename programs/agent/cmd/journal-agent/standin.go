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
// terminal into the file and draws the typed text on its screen.
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

	return errors.New("usage: journal-agent standin docker --socket <path> --image <reference>... | standin recording ...")
}

func standinDocker(arguments []string) error {
	flags := flag.NewFlagSet("standin docker", flag.ContinueOnError)
	socket := flags.String("socket", "", "the Unix socket the daemon listens on")
	image := flags.String("image", "", "an image the daemon holds, by digest")
	untilInputEnds := flags.Bool("until-input-ends", false, "stop once standard input ends")
	sessionRecording := flags.String("recording", "", "the terminal recording a session's container plays; echo without one")
	program := flags.String("executable", "", "the executable a session's container runs, by its name")
	versionLine := flags.String("version-line", "", "what the program prints for --version")
	signInLine := flags.String("sign-in-line", "", "what the program prints for auth, its $VARIABLES from the container's environment")
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
		programs = programInContainer(standinProgram{*program, *versionLine, *signInLine}, replayProgram(fixture))
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
	name, versionLine, signInLine string
}

// programInContainer answers a container as the program would in it: its version, its sign-in, and on a terminal
// the session's recording; a container that does not run it, such as a throwaway, ends at once.
func programInContainer(program standinProgram, session dockerstandin.Program) func(*dockerstandin.Container) dockerstandin.Program {
	return func(container *dockerstandin.Container) dockerstandin.Program {
		arguments, found := argumentsAfter(container.Config.Cmd, program.name)
		switch {
		case !found:
			return nil
		case slices.Contains(arguments, "--version"):
			return dockerstandin.Printing(program.versionLine+"\n", 0)
		case len(arguments) > 0 && arguments[0] == "auth":
			return dockerstandin.Printing(os.Expand(program.signInLine, variablesOf(container.Config.Env))+"\n", 0)
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
	opened, err := os.OpenFile(file, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	defer opened.Close()
	_, err = fmt.Fprintln(opened, string(line))
	return err
}

func noteStart(file string, arguments []string) error {
	line, err := json.Marshal(arguments)
	if err != nil {
		return err
	}
	opened, err := os.OpenFile(file, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	defer opened.Close()
	_, err = fmt.Fprintln(opened, string(line))
	return err
}

func writeTranscript(path string) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	return os.WriteFile(path, []byte(`{"type":"user"}`+"\n"), 0o600)
}
