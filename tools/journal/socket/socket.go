// Package socket names the journal server's Unix socket for a journal's folder and speaks HTTP over it, for the
// client and the hook alike.
package socket

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"net"
	"net/http"
	"path/filepath"
)

// PathLimit is the longest socket path the server binds in the journal's folder; past it both sides use a
// short path under /tmp named by a hash of the long one, as the server's socket_path does.
const PathLimit = 100

// Path is the server's socket for a journal's folder.
func Path(home string) string {
	return NamedPath(home, "server")
}

// NamedPath is the socket of one name, the server's or the launcher's, for a journal's folder.
func NamedPath(home string, name string) string {
	resolved, err := filepath.EvalSymlinks(home)
	if err != nil {
		resolved = home
	}
	absolute, err := filepath.Abs(resolved)
	if err != nil {
		absolute = resolved
	}
	path := filepath.Join(absolute, name+".sock")
	if len(path) <= PathLimit {
		return path
	}
	sum := sha256.Sum256([]byte(path))
	return filepath.Join("/tmp", "journal-"+hex.EncodeToString(sum[:])[:16]+".sock")
}

// Transport sends HTTP requests over the server's Unix socket.
func Transport(path string) http.RoundTripper {
	dial := func(ctx context.Context, _, _ string) (net.Conn, error) {
		var dialer net.Dialer
		return dialer.DialContext(ctx, "unix", path)
	}
	return &http.Transport{DialContext: dial}
}

// Client speaks HTTP over the server's Unix socket.
func Client(path string) *http.Client {
	return &http.Client{Transport: Transport(path)}
}
