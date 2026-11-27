package host

import (
	"context"
	"io"

	"github.com/moby/moby/api/pkg/stdcopy"
	"github.com/moby/moby/client"
)

// FollowOutput is what the process of a container without a terminal printed on its standard output and error, from
// the container's first start on and following it until it ends, so nothing printed before the host read it is lost;
// a program may print its answer on either, as one prints its sign-in on its error stream.
// Closing it stops the reading; the process runs on.
func (containers Containers) FollowOutput(ctx context.Context, name string) (io.ReadCloser, error) {
	logs, err := containers.Daemon.ContainerLogs(ctx, name, client.ContainerLogsOptions{
		ShowStdout: true, ShowStderr: true, Follow: true,
	})
	if err != nil {
		return nil, err
	}
	reader, writer := io.Pipe()
	go func() {
		_, err := stdcopy.StdCopy(writer, writer, logs)
		_ = writer.CloseWithError(err)
	}()
	return followed{Reader: reader, logs: logs}, nil
}

// followed is the demultiplexed output of a container's log, closed with the log it reads.
type followed struct {
	io.Reader
	logs io.Closer
}

func (output followed) Close() error {
	return output.logs.Close()
}
