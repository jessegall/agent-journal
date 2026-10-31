package main

import (
	"net"
	"os"
	"os/exec"
	"time"

	"github.com/jessegall/agent-journal/tools/journal/socket"
)

// Client is how the runner talks to the journal: whether its server answers, and a command through the journal client.
type Client interface {
	Reachable() bool
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

func (client JournalClient) Run(arguments ...string) error {
	command := exec.Command("journal", arguments...)
	command.Env = append(os.Environ(), "JOURNAL_HOME="+client.Home)
	return command.Run()
}
