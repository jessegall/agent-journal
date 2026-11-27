package host

import (
	"context"
	"encoding/binary"
	"io"

	"github.com/moby/moby/api/pkg/stdcopy"
	"github.com/moby/moby/client"
)

// FollowOutput is the log of a container without a terminal: everything its process printed on its standard output
// and error, from the container's first start on and following it until it ends, so nothing printed before the host
// read it is lost. Read it with NextPrinted, which keeps each piece's stream.
func (containers Containers) FollowOutput(ctx context.Context, name string) (io.ReadCloser, error) {
	return containers.Daemon.ContainerLogs(ctx, name, client.ContainerLogsOptions{
		ShowStdout: true, ShowStderr: true, Follow: true,
	})
}

// PrintedPiece is one piece of a container's log: what was printed and whether on the error stream.
type PrintedPiece struct {
	Bytes   []byte
	IsError bool
}

// NextPrinted reads the next piece of a container's log, as Docker frames it: an eight-byte header naming the stream
// and the size, then the bytes.
func NextPrinted(log io.Reader) (PrintedPiece, error) {
	header := make([]byte, 8)
	if _, err := io.ReadFull(log, header); err != nil {
		return PrintedPiece{}, err
	}
	printed := make([]byte, binary.BigEndian.Uint32(header[4:]))
	if _, err := io.ReadFull(log, printed); err != nil {
		return PrintedPiece{}, err
	}
	return PrintedPiece{Bytes: printed, IsError: header[0] == byte(stdcopy.Stderr)}, nil
}
