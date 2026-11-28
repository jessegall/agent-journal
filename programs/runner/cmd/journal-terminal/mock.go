//go:build mock

package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"golang.org/x/term"

	"journal-runner/recorded"
	"journal-runner/recording"
)

func init() {
	developmentCommand = mock
}

func mock(arguments []string) error {
	if len(arguments) == 0 {
		return errors.New("name the terminal mock to run")
	}
	switch arguments[0] {
	case "recording":
		return mockRecording(arguments[1:])
	case "keys":
		return mockKeys(arguments[1:])
	case "scenario":
		return mockScenario(arguments[1:])
	case "launch":
		return launchMockTerminal(arguments[1:])
	default:
		return fmt.Errorf("the terminal has no mock %s", arguments[0])
	}
}

const mockPause = 20 * time.Millisecond

// keysPrompt is what the key recorder draws first, so a test sees it is ready.
const keysPrompt = "keys> "

// crashLine is the typed line that makes the recording mock exit 1, as a crash.
const crashLine = "crash"

// errCrashed is the mock's crash, asked for by its typed input.
var errCrashed = errors.New("crash typed")

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

func noteStart(file string, arguments []string) error {
	line, err := json.Marshal(arguments)
	if err != nil {
		return err
	}
	return recorded.AppendLine(file, string(line))
}

func writeTranscript(path string) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	return os.WriteFile(path, []byte(`{"type":"user"}`+"\n"), 0o600)
}

