package main

import (
	"bytes"
	"context"
	"flag"
	"io"
	"net"
	"os"
	"os/exec"
	"time"
)

const (
	// mostStatusLineInput bounds what is read of the status-line input the driver writes.
	mostStatusLineInput = 64 * 1024
	relayWait           = 300 * time.Millisecond
	renderWait          = 5 * time.Second
)

// statusLine is the status-line command of a journal start: it reads the bounded input the driver gives, hands it to
// the start's relay socket, where the journal decodes the limit windows of it, and prints nothing but what the status line it took the
// place of prints, run once on the same input. It always ends well and quickly: a relay that is down loses the
// reading, never the status line.
func statusLine(arguments []string) error {
	runStatusLine(arguments, os.Stdin, os.Stdout)
	return nil
}

func runStatusLine(arguments []string, stdin io.Reader, stdout io.Writer) {
	flags := flag.NewFlagSet("status-line", flag.ContinueOnError)
	flags.SetOutput(io.Discard)
	relay := flags.String("relay", "", "the start's status-line relay socket")
	then := flags.String("then", "", "the status line this one took the place of, run with the same input")
	if flags.Parse(arguments) != nil {
		return
	}
	input, _ := io.ReadAll(io.LimitReader(stdin, mostStatusLineInput))
	sendStatusLine(*relay, input)
	renderStatusLine(*then, input, stdout)
}

// sendStatusLine hands the bounded input to the relay socket as it came; the journal decodes what it reads of it.
func sendStatusLine(relay string, input []byte) {
	if relay == "" {
		return
	}
	connection, err := net.DialTimeout("unix", relay, relayWait)
	if err != nil {
		return
	}
	defer connection.Close()
	_ = connection.SetWriteDeadline(time.Now().Add(relayWait))
	_, _ = connection.Write(input)
}

func renderStatusLine(command string, input []byte, stdout io.Writer) {
	if command == "" {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), renderWait)
	defer cancel()
	render := exec.CommandContext(ctx, "sh", "-c", command)
	render.Stdin = bytes.NewReader(input)
	render.Stdout = stdout
	render.Stderr = os.Stderr
	_ = render.Run()
}
