package main

import (
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// Client is how the runner talks to the journal: whether its server answers, and a command through the journal client.
type Client interface {
	Reachable() bool
	Restarting() bool
	Run(arguments ...string) error
}

// JournalClient is the real Client: the journal's socket and the journal program on the path.
type JournalClient struct {
	Home string
}

func (client JournalClient) Reachable() bool {
	connection, err := net.DialTimeout("unix", socket.Path(client.Home), time.Second)
	if err != nil {
		return false
	}
	connection.Close()
	return true
}

// Restarting says whether a server that stops for new code left its restart mark, as a stale server still accepts the
// socket then.
func (client JournalClient) Restarting() bool {
	_, err := os.Stat(filepath.Join(client.Home, "server-restarting"))
	return err == nil
}

func (client JournalClient) Run(arguments ...string) error {
	command := exec.Command(filepath.Join(client.Home, "bin", "journal"), arguments...)
	command.Env = journalEnvironment(client.Home)
	return command.Run()
}
