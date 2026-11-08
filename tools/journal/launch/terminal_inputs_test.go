package launch

import (
	"bufio"
	"encoding/json"
	"io"
	"net"
	"os"
	"path/filepath"
	"strings"
	"sync"
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

func TestATerminalsAnswersToItsProgramsQuestionsAreNotTypedText(t *testing.T) {
	answers := map[string]string{
		"version":           "\x1bP>|iTerm2 3.7.3\x1b\\",
		"keyboard":          "\x1b[?0u",
		"device attributes": "\x1b[?64;1;2;4;6;17;18;21;22c",
		"mode report":       "\x1b[?2026;2$y",
		"colour":            "\x1b]11;rgb:1818/1919/1c1c\x07",
	}
	for name, answer := range answers {
		t.Run(name, func(t *testing.T) {
			line := &inputLine{}
			line.keys([]byte("ab" + answer + "c"))
			if got := string(line.text); got != "abc" {
				t.Fatalf("pending text is %q", got)
			}
		})
	}
}

func TestATerminalAnswerSplitAcrossTwoReadsIsNotTypedText(t *testing.T) {
	line := &inputLine{}
	line.keys([]byte("\x1bP>|iTe"))
	line.keys([]byte("rm2 3.7.3\x1b"))
	line.keys([]byte("\\x"))
	if got := string(line.text); got != "x" {
		t.Fatalf("pending text is %q", got)
	}
}

func TestAKeyWithAnEscapeSequenceStaysOutOfTheLineAndTypingGoesOn(t *testing.T) {
	for _, key := range []string{"\x1b[A", "\x1b[3~", "\x1bOP", "\x1bO1;5P", "\x1bb"} {
		line := &inputLine{}
		line.keys([]byte("a" + key + "b"))
		if got := string(line.text); got != "ab" {
			t.Fatalf("after %q the pending text is %q", key, got)
		}
	}
}

func TestTwoLinesTypedTogetherAreEnteredOneAtATime(t *testing.T) {
	inputs := NewTerminalInputs()
	reader, _ := io.Pipe()
	terminal := bufio.NewReader(inputs.Open(1, reader))
	var typing sync.WaitGroup
	for _, line := range []string{"first line", "second line"} {
		typing.Add(1)
		go func() {
			defer typing.Done()
			inputs.TypeLine(1, line)
		}()
	}
	entered := []string{}
	for range 2 {
		text, err := terminal.ReadString('\r')
		if err != nil {
			t.Fatal(err)
		}
		entered = append(entered, strings.TrimSuffix(text, "\r"))
	}
	typing.Wait()
	if !(entered[0] == "first line" && entered[1] == "second line" || entered[0] == "second line" && entered[1] == "first line") {
		t.Fatalf("entered %q", entered)
	}
}
