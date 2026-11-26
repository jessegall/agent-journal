//go:build standin

package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"net"
	"os"
	"os/signal"
	"path/filepath"
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
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	listener, err := net.Listen("unix", *socket)
	if err != nil {
		return err
	}
	daemon := dockerstandin.Serve(listener, *image)
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program { return dockerstandin.EchoProgram }
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
