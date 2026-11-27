// Package executor runs the commands a contained program asks for as the tools user, over a private socket: the
// program's user sends command data alone, never an identity, an executable, an environment or a descriptor.
package executor

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
)

// Frame types: the peer sends a request, then stdin, eof, resize and signal frames; the executor answers stdout and
// stderr frames and one exit frame, or one refused frame and nothing else.
const (
	FrameRequest = "request"
	FrameStdin   = "stdin"
	FrameEOF     = "eof"
	FrameResize  = "resize"
	FrameSignal  = "signal"
	FrameStdout  = "stdout"
	FrameStderr  = "stderr"
	FrameExit    = "exit"
	FrameRefused = "refused"
)

// maxFrameBytes bounds one frame, so a wrong length prefix cannot make the executor allocate without end.
const maxFrameBytes = 1 << 20

// ErrFrameMalformed is a frame that is too long, is not JSON or has no type.
var ErrFrameMalformed = errors.New("the frame is malformed")

// Frame is one length-prefixed JSON message of the protocol; each type uses only its own fields.
type Frame struct {
	Type    string `json:"type"`
	Command string `json:"command,omitempty"`
	Cwd     string `json:"cwd,omitempty"`
	Tty     bool   `json:"tty,omitempty"`
	Rows    uint16 `json:"rows,omitempty"`
	Cols    uint16 `json:"cols,omitempty"`
	Data    []byte `json:"data,omitempty"`
	Signal  string `json:"signal,omitempty"`
	Code    int    `json:"code,omitempty"`
	Reason  string `json:"reason,omitempty"`
}

// WriteFrame writes the frame as a four-byte big-endian length and its JSON.
func WriteFrame(writer io.Writer, frame Frame) error {
	body, err := json.Marshal(frame)
	if err != nil {
		return err
	}

	prefix := make([]byte, 4)
	binary.BigEndian.PutUint32(prefix, uint32(len(body)))
	_, err = writer.Write(append(prefix, body...))

	return err
}

// ReadFrame reads one frame; a read error passes through, anything else wrong is ErrFrameMalformed.
func ReadFrame(reader io.Reader) (Frame, error) {
	prefix := make([]byte, 4)
	if _, err := io.ReadFull(reader, prefix); err != nil {
		return Frame{}, err
	}

	length := binary.BigEndian.Uint32(prefix)
	if length == 0 || length > maxFrameBytes {
		return Frame{}, fmt.Errorf("%w: %d bytes", ErrFrameMalformed, length)
	}

	body := make([]byte, length)
	if _, err := io.ReadFull(reader, body); err != nil {
		return Frame{}, err
	}

	var frame Frame
	if err := json.Unmarshal(body, &frame); err != nil || frame.Type == "" {
		return Frame{}, fmt.Errorf("%w: %v", ErrFrameMalformed, err)
	}

	return frame, nil
}
