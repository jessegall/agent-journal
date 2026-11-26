package main

import (
	"bytes"
	"io"
	"net"
	"path/filepath"
	"strings"
	"testing"
)

func TestTheStatusLineHandsItsInputToTheRelayAsItCame(t *testing.T) {
	relay := filepath.Join(t.TempDir(), "status")
	listener, err := net.Listen("unix", relay)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	received := make(chan string, 1)
	go func() {
		connection, err := listener.Accept()
		if err != nil {
			received <- ""
			return
		}
		defer connection.Close()
		bytes, _ := io.ReadAll(connection)
		received <- string(bytes)
	}()
	input := `{"model":{"id":"m"},"rate_limits":{"five_hour":{"used_percentage":12}}}`

	var printed bytes.Buffer
	runStatusLine([]string{"--relay", relay}, strings.NewReader(input), &printed)

	if got := <-received; got != input || printed.Len() != 0 {
		t.Fatalf("the relay got %q and the status line printed %q", got, printed.String())
	}
}
