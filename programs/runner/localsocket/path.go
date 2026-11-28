package localsocket

import (
	"context"
	"net"
	"os"
	"path/filepath"
)

// unixPathLimit is below sockaddr_un's pathname limit on the supported platforms.
const unixPathLimit = 104

// Listen binds the socket at path, using a short name for the same directory on long paths.
func Listen(path string) (net.Listener, error) {
	socket, removeAlias, err := shortPath(path)
	if err != nil {
		return nil, err
	}
	listener, err := net.Listen("unix", socket)
	if err != nil {
		removeAlias()
		return nil, err
	}
	return listenerAtPath{Listener: listener, removeAlias: removeAlias}, nil
}

// Dial connects to the same socket even if its full pathname is too long for sockaddr_un.
func Dial(ctx context.Context, dialer net.Dialer, path string) (net.Conn, error) {
	socket, removeAlias, err := shortPath(path)
	if err != nil {
		return nil, err
	}
	defer removeAlias()
	return dialer.DialContext(ctx, "unix", socket)
}

type listenerAtPath struct {
	net.Listener
	removeAlias func()
}

func (listener listenerAtPath) Close() error {
	err := listener.Listener.Close()
	listener.removeAlias()
	return err
}

func shortPath(path string) (string, func(), error) {
	if len(path) < unixPathLimit {
		return path, func() {}, nil
	}
	folder, err := filepath.Abs(filepath.Dir(path))
	if err != nil {
		return "", nil, err
	}
	short, err := os.MkdirTemp("/tmp", "journal-socket-")
	if err != nil {
		return "", nil, err
	}
	remove := func() { _ = os.RemoveAll(short) }
	alias := filepath.Join(short, "socket")
	if err := os.Symlink(folder, alias); err != nil {
		remove()
		return "", nil, err
	}
	return filepath.Join(alias, filepath.Base(path)), remove, nil
}
