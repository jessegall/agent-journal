package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net"
	"os/exec"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-runner/hostapi"
	"journal-runner/localsocket"
	"journal-runner/terminal"
)

type capturedDisplay struct {
	mutex sync.Mutex
	text  bytes.Buffer
}

func (display *capturedDisplay) Write(printed []byte) (int, error) {
	display.mutex.Lock()
	defer display.mutex.Unlock()
	return display.text.Write(printed)
}

func (display *capturedDisplay) String() string {
	display.mutex.Lock()
	defer display.mutex.Unlock()
	return display.text.String()
}

func TestTheRelayAdoptsTheTerminalAndForwardsItsKeysAndResize(t *testing.T) {
	const processID = "terminal-process"
	folder := t.TempDir()
	relay, err := listenTerminal(folder, processID)
	if err != nil {
		t.Fatal(err)
	}
	defer relay.Close()
	command := exec.Command("/bin/sh", "-c", "stty -echo; printf 'ready\\n'; read local; printf 'local=%s\\n' \"$local\"; "+
		"read remote; printf 'remote=%s\\n' \"$remote\"; stty size")
	display := &capturedDisplay{}
	size := hostapi.TerminalSize{Rows: 24, Columns: 80}
	session, err := terminal.Start(command, hostapi.OpenPlan{Size: size, DrainMs: 1000}, display, relay.post)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _, _ = session.Stop(hostapi.StopPlan{GraceMs: 100, ForceMs: 100}) })
	go relay.Serve(session, processID, size)

	link := openRelayLink(t, folder, processID, size)
	if err := sendInstruction(link, processID, "stream", hostapi.StreamPlan{FramesPerSecond: 100}); err != nil {
		t.Fatal(err)
	}
	waitForAnswer(t, link, "stream")
	waitForFrame(t, link, "ready")
	if _, err := session.Write([]byte("person\n")); err != nil {
		t.Fatal(err)
	}
	waitForFrame(t, link, "local=person")

	if err := sendInstruction(link, processID, "resize", hostapi.TerminalSize{Rows: 36, Columns: 100}); err != nil {
		t.Fatal(err)
	}
	waitForAnswer(t, link, "resize")
	if err := sendInstruction(link, processID, "write_keys",
		hostapi.KeyWrite{Bytes: []byte("journal\n"), AsUser: true}); err != nil {
		t.Fatal(err)
	}
	waitForAnswer(t, link, "write_keys")

	for {
		message, body, err := link.Receive()
		if err != nil {
			t.Fatal(err)
		}
		if message == hostapi.LinkExit {
			exit, err := hostapi.ReadLocalLinkExit(body)
			if err != nil || exit.Code != 0 {
				t.Fatalf("the terminal ended with %+v, %v", exit, err)
			}
			break
		}
	}
	printed := display.String()
	for _, text := range []string{"local=person", "remote=journal", "36 100"} {
		if !strings.Contains(printed, text) {
			t.Fatalf("the local display did not get %q: %q", text, printed)
		}
	}
}

func openRelayLink(t *testing.T, folder, processID string, size hostapi.TerminalSize) *hostapi.TerminalLink {
	t.Helper()
	connection, err := localsocket.Dial(t.Context(), net.Dialer{}, hostapi.TerminalSocket(folder, processID))
	if err != nil {
		t.Fatal(err)
	}
	_ = connection.SetDeadline(time.Now().Add(5 * time.Second))
	link := hostapi.NewTerminalLink(connection)
	t.Cleanup(func() { _ = link.Close() })
	message, body, err := link.Receive()
	if err != nil || message != hostapi.LinkAdopt {
		t.Fatalf("the terminal did not introduce itself: %s, %v", message, err)
	}
	adopt, err := hostapi.ReadLocalLinkAdopt(body)
	if err != nil || adopt.ProcessID != processID || adopt.Generation != 1 || adopt.Size != size {
		t.Fatalf("the adoption was %+v, %v", adopt, err)
	}
	return link
}

func sendInstruction(link *hostapi.TerminalLink, processID, name string, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	return link.Send(hostapi.LinkInstruction, hostapi.Instruction{
		ID: name, Type: name, ProcessID: processID, Payload: string(body),
	})
}

func waitForFrame(t *testing.T, link *hostapi.TerminalLink, text string) {
	t.Helper()
	for {
		message, body, err := link.Receive()
		if err != nil {
			t.Fatal(err)
		}
		if message == hostapi.LinkOutput {
			output, err := hostapi.ReadLocalLinkOutput(body)
			if err != nil {
				t.Fatal(err)
			}
			for _, frame := range output.Frames {
				if strings.Contains(strings.Join(frame.Rows, "\n"), text) {
					return
				}
			}
		}
	}
}

func waitForAnswer(t *testing.T, link *hostapi.TerminalLink, id string) {
	t.Helper()
	for {
		message, body, err := link.Receive()
		if err != nil {
			if err == io.EOF {
				t.Fatalf("the terminal ended before answering %s", id)
			}
			t.Fatal(err)
		}
		if message == hostapi.LinkAnswer {
			answer, err := hostapi.ReadLocalLinkAnswer(body)
			if err != nil || answer.InstructionID != id || answer.Status != hostapi.Done {
				t.Fatalf("the instruction was answered %+v, %v", answer, err)
			}
			return
		}
	}
}
