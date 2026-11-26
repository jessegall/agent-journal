package host

import (
	"context"
	"io"

	"github.com/moby/moby/api/pkg/stdcopy"
	"github.com/moby/moby/client"
)

// FollowOutput is what the process of a container without a terminal printed on its standard output, from the
// container's first start on and following it until it ends, so nothing printed before the host read it is lost.
// Closing it stops the reading; the process runs on.
func (containers Containers) FollowOutput(ctx context.Context, name string) (io.ReadCloser, error) {
	logs, err := containers.Daemon.ContainerLogs(ctx, name, client.ContainerLogsOptions{
		ShowStdout: true, Follow: true,
	})
	if err != nil {
		return nil, err
	}
	reader, writer := io.Pipe()
	go func() {
		_, err := stdcopy.StdCopy(writer, io.Discard, logs)
		_ = writer.CloseWithError(err)
	}()
	return followed{Reader: reader, logs: logs}, nil
}

// followed is the demultiplexed standard output of a container's log, closed with the log it reads.
type followed struct {
	io.Reader
	logs io.Closer
}

func (output followed) Close() error {
	return output.logs.Close()
}
