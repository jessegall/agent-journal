package dockermock

import (
	"context"
	"io"
	"slices"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// RecordedProgram is a program played from a driver exchange the journal recorded: it prints the recorded output, each
// group once the input recorded before it is typed, and ends with the recorded exit code once it printed it whole.
type RecordedProgram struct {
	fixture recording.Fixture
}

// RecordedProgramOf is the program of the scenario's first driver exchange whose command holds the word, such as
// "auth" for the sign-in status probe; a scenario without one fails the test.
func RecordedProgramOf(t testing.TB, scenario, word string) RecordedProgram {
	t.Helper()
	for _, exchange := range recorded.MustLoad(t, scenario).ExchangesOn(recording.WireDriver) {
		if !slices.Contains(exchange.Opening.Argv, word) {
			continue
		}
		fixture, err := recording.Load(exchange.Folder)
		if err != nil {
			t.Fatalf("reading the recorded program %s of %s: %v", word, scenario, err)
		}
		return RecordedProgram{fixture: fixture}
	}
	t.Fatalf("the recording %s ran no program with %q", scenario, word)

	return RecordedProgram{}
}

// Run plays the recording in the container until it printed it whole or its input ended; a stopped container ends it
// at once.
func (program RecordedProgram) Run(ctx context.Context, _ *Container, input io.Reader, output io.Writer) int {
	played := make(chan struct{})
	var once sync.Once
	counted := &countedOutput{
		next:   momentless{output},
		left:   recordedLength(program.fixture),
		played: func() { once.Do(func() { close(played) }) },
	}
	if counted.left == 0 {
		counted.played()
	}
	inputEnded := make(chan struct{})
	go func() {
		_ = recording.GatedReplay(program.fixture, input, counted, playedPause, anyTyped)
		close(inputEnded)
	}()
	select {
	case <-ctx.Done():
		return stoppedCode
	case <-played:
	case <-inputEnded:
	}

	return program.fixture.ExitCode
}

// PrintedBefore is what the program printed before it read its input of that number, counted from 0.
func (program RecordedProgram) PrintedBefore(input int) string {
	printed := ""
	for _, chunk := range program.fixture.Output {
		if input < len(program.fixture.Inputs) && chunk.Offset >= program.fixture.Inputs[input].Offset {
			break
		}
		printed += string(chunk.Bytes)
	}

	return printed
}

// PrintedAfter is what the program printed after it read its input of that number and before the next.
func (program RecordedProgram) PrintedAfter(input int) string {
	return strings.TrimPrefix(program.PrintedBefore(input+1), program.PrintedBefore(input))
}

// Input is what was typed into the program as its input of that number, counted from 0.
func (program RecordedProgram) Input(input int) []byte {
	return program.fixture.Inputs[input].Bytes
}

// Inputs is everything typed into the program, in order, as one piece.
func (program RecordedProgram) Inputs() []byte {
	var typed []byte
	for _, input := range program.fixture.Inputs {
		typed = append(typed, input.Bytes...)
	}

	return typed
}

// Printed is everything the program printed.
func (program RecordedProgram) Printed() string {
	return program.PrintedBefore(len(program.fixture.Inputs))
}

// ExitCode is the code the recorded program ended with.
func (program RecordedProgram) ExitCode() int {
	return program.fixture.ExitCode
}

// momentless passes output on to a writer that follows no recorded moments.
type momentless struct{ io.Writer }

func (momentless) Reached(time.Duration) error { return nil }

func anyTyped(recording.Typed) error { return nil }
