package launch

import (
	"bufio"
	"encoding/json"
	"io"
	"net"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func shortSocket(t *testing.T) string {
	t.Helper()
	folder, err := os.MkdirTemp("", "ti")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(folder) })
	return filepath.Join(folder, "l.sock")
}

func typedRequest(t *testing.T, socket string, request WorkerRequest) string {
	t.Helper()
	connection, err := net.Dial("unix", socket)
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Close()
	if err := json.NewEncoder(connection).Encode(request); err != nil {
		t.Fatal(err)
	}
	answer, _ := bufio.NewReader(connection).ReadString('\n')
	return strings.TrimSpace(answer)
}

func TestALineTypedThroughTheSocketReachesTheAgentsTerminalWithItsEnter(t *testing.T) {
	inputs := NewTerminalInputs()
	socket := shortSocket(t)
	listener, err := Listen(socket, nil, inputs)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	reader := inputs.Open(7, strings.NewReader(""))
	received := make(chan string, 1)
	go func() {
		text := make([]byte, len("ls -la\r"))
		_, _ = io.ReadFull(reader, text)
		received <- string(text)
	}()
	if answer := typedRequest(t, socket, WorkerRequest{AgentID: 7, InputLine: "ls -la"}); answer != TypedAnswer {
		t.Fatalf("the answer was %q", answer)
	}
	if text := <-received; text != "ls -la\r" {
		t.Fatalf("the terminal read %q", text)
	}
}

func TestALineForAnAgentWithNoTerminalIsNotAnswered(t *testing.T) {
	inputs := NewTerminalInputs()
	socket := shortSocket(t)
	listener, err := Listen(socket, nil, inputs)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	if answer := typedRequest(t, socket, WorkerRequest{AgentID: 9, InputLine: "ls"}); answer != "" {
		t.Fatalf("the answer was %q", answer)
	}
}

func TestWhatThePersonTypesStillReachesTheTerminalAndAClosedInputTakesNoLine(t *testing.T) {
	inputs := NewTerminalInputs()
	reader := inputs.Open(3, strings.NewReader("keys"))
	text := make([]byte, 4)
	if _, err := io.ReadFull(reader, text); err != nil || string(text) != "keys" {
		t.Fatalf("the terminal read %q, %v", text, err)
	}
	inputs.Close(3)
	if inputs.TypeLine(3, "ls") {
		t.Fatal("a closed input took a line")
	}
}
