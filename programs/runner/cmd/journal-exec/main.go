// Command journal-exec is the fixed shell executor of a protected-account container: it runs as the tools user and
// serves only the program's user over a private socket.
package main

import (
	"fmt"
	"net"
	"os"

	"journal-runner/executor"
)

func main() {
	_ = os.Remove(executor.SocketPath)
	listener, err := net.ListenUnix("unix", &net.UnixAddr{Name: executor.SocketPath, Net: "unix"})
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-exec: listening failed:", err)
		os.Exit(1)
	}

	if err := os.Chmod(executor.SocketPath, 0o666); err != nil {
		fmt.Fprintln(os.Stderr, "journal-exec: opening the socket failed:", err)
		os.Exit(1)
	}

	fmt.Println(executor.ReadyLine)

	if err := executor.NewServer().Serve(listener); err != nil {
		fmt.Fprintln(os.Stderr, "journal-exec: serving ended:", err)
		os.Exit(1)
	}
}
