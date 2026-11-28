package recording

import (
	"bytes"
	"errors"
	"io"
	"time"
)

// TypedType is what a piece of typed input is: a key, such as an arrow, Enter or Esc, or text, typed or pasted.
type TypedType int

const (
	TypedKey TypedType = iota
	TypedText
)

// Typed is one piece of input a program read: a key by its bytes, or text without its paste markers.
type Typed struct {
	Type  TypedType
	Bytes []byte
}

// signalInput is how a recording writes a signal the program got among its inputs, such as <SIGTERM>.
var signalInput = []byte("<SIG")

var (
	pasteStart = []byte("\x1b[200~")
	pasteEnd   = []byte("\x1b[201~")
)

// ErrReplayStopped is returned when the program's typed input asked the replay to stop.
var ErrReplayStopped = errors.New("the replay was stopped by its input")

// GatedReplay plays the fixture by its inputs instead of its clock: the output up to the first typed text goes at once,
// as a trusted folder skips its trust screen, and each later group of output goes once the program read an input of
// the recorded kind (the same key, or any text). Within a group a chunk waits its recorded gap, at most pause, so a
// screen draws as it did. Each piece read is handed to heard first; an error from it stops the replay with it.
func GatedReplay(fixture Fixture, input io.Reader, output io.Writer, pause time.Duration, heard func(Typed) error) error {
	gates := gatesOf(fixture.Inputs)
	groups := outputGroups(fixture)
	first := firstTextGate(gates)
	for _, group := range groups[:first+1] {
		if err := writeGroup(output, group, pause); err != nil {
			return err
		}
	}

	pieces := make(chan Typed)
	failure := make(chan error, 1)
	go readTyped(input, pieces, failure)

	for gate := first; gate < len(gates); gate++ {
		if err := awaitGate(gates[gate], pieces, failure, heard); err != nil {
			return err
		}
		if err := writeGroup(output, groups[gate+1], pause); err != nil {
			return err
		}
	}

	return drain(pieces, failure, heard)
}

// gatesOf is each recorded input as the piece that opens its group; a signal opens nothing, the replay ends there.
func gatesOf(inputs []InputEvent) []Typed {
	gates := make([]Typed, 0, len(inputs))
	for _, input := range inputs {
		if bytes.HasPrefix(input.Bytes, signalInput) {
			break
		}
		gates = append(gates, typedOf(input.Bytes)[0])
	}

	return gates
}

// outputGroups splits the output at each recorded input: group 0 before the first, group n after input n.
func outputGroups(fixture Fixture) [][]OutputChunk {
	groups := make([][]OutputChunk, len(fixture.Inputs)+1)
	input := 0
	for _, chunk := range fixture.Output {
		for input < len(fixture.Inputs) && fixture.Inputs[input].Offset <= chunk.Offset {
			input++
		}
		groups[input] = append(groups[input], chunk)
	}

	return groups
}

func firstTextGate(gates []Typed) int {
	for index, gate := range gates {
		if gate.Type == TypedText {
			return index
		}
	}

	return len(gates)
}

// MomentFollower is an output told each chunk's recorded moment before the chunk is written, as a mock that runs the
// recorded hooks at their places.
type MomentFollower interface {
	Reached(offset time.Duration) error
}

func writeGroup(output io.Writer, group []OutputChunk, pause time.Duration) error {
	follower, isFollowing := output.(MomentFollower)
	for index, chunk := range group {
		if index > 0 {
			time.Sleep(min(chunk.Offset-group[index-1].Offset, pause))
		}
		if isFollowing {
			if err := follower.Reached(chunk.Offset); err != nil {
				return err
			}
		}
		if _, err := output.Write(chunk.Bytes); err != nil {
			return err
		}
	}

	return nil
}

// awaitGate reads pieces until one opens the gate: the same key, or any text for a text gate.
func awaitGate(gate Typed, pieces <-chan Typed, failure <-chan error, heard func(Typed) error) error {
	for {
		select {
		case piece := <-pieces:
			if err := heard(piece); err != nil {
				return err
			}
			if piece.Type == gate.Type && (gate.Type == TypedText || bytes.Equal(piece.Bytes, gate.Bytes)) {
				return nil
			}
		case err := <-failure:
			return err
		}
	}
}

// drain hands on what is typed after the last group until the input ends.
func drain(pieces <-chan Typed, failure <-chan error, heard func(Typed) error) error {
	for {
		select {
		case piece := <-pieces:
			if err := heard(piece); err != nil {
				return err
			}
		case err := <-failure:
			return err
		}
	}
}

// readTyped splits what is read into pieces until the input ends, then sends the end, nil for a plain end of input.
func readTyped(input io.Reader, pieces chan<- Typed, failure chan<- error) {
	buffer := make([]byte, 4096)
	for {
		count, err := input.Read(buffer)
		for _, piece := range typedOf(buffer[:count]) {
			pieces <- piece
		}
		if errors.Is(err, io.EOF) {
			failure <- nil
			return
		}
		if err != nil {
			failure <- err
			return
		}
	}
}

// typedOf splits bytes read at once into pieces: a paste is text, an escape sequence, Esc, Enter or another control
// byte is a key, and a run of printable bytes is text.
func typedOf(read []byte) []Typed {
	var pieces []Typed
	for len(read) > 0 {
		var piece Typed
		piece, read = nextTyped(read)
		pieces = append(pieces, piece)
	}

	return pieces
}

func nextTyped(read []byte) (Typed, []byte) {
	if bytes.HasPrefix(read, pasteStart) {
		pasted := read[len(pasteStart):]
		end := bytes.Index(pasted, pasteEnd)
		if end < 0 {
			return Typed{Type: TypedText, Bytes: pasted}, nil
		}
		return Typed{Type: TypedText, Bytes: pasted[:end]}, pasted[end+len(pasteEnd):]
	}
	if read[0] == 0x1b {
		length := escapeLength(read)
		return Typed{Type: TypedKey, Bytes: read[:length]}, read[length:]
	}
	if read[0] < 0x20 || read[0] == 0x7f {
		return Typed{Type: TypedKey, Bytes: read[:1]}, read[1:]
	}
	end := 1
	for end < len(read) && read[end] >= 0x20 && read[end] != 0x7f {
		end++
	}

	return Typed{Type: TypedText, Bytes: read[:end]}, read[end:]
}

// escapeLength is how long the escape sequence at the start is: Esc alone, or Esc [ up to its final byte.
func escapeLength(read []byte) int {
	if len(read) < 2 || read[1] != '[' {
		return 1
	}
	for index := 2; index < len(read); index++ {
		if read[index] >= 0x40 && read[index] <= 0x7e {
			return index + 1
		}
	}

	return len(read)
}
