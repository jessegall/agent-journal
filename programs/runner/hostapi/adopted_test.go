package hostapi

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"net"
	"os"
	"reflect"
	"testing"
	"time"

	"journal-runner/host"
)

func TestAdoptedTerminalForwardsInstructionsAndReportsOutputAndExit(t *testing.T) {
	state, listener := terminalListener(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	posted := make(chan Output, 1)
	table := terminalTable(t, state, func(_ string, output Output) error {
		posted <- output
		return nil
	})
	peer := terminalPeer(t, listener, 1)
	if err := table.AdoptTerminals(ctx); err != nil {
		t.Fatal(err)
	}
	link := <-peer
	defer link.Close()
	if live := table.Live(); !reflect.DeepEqual(live, []string{"session"}) {
		t.Fatalf("live processes = %v", live)
	}

	record, err := OpenAnsweredRecord(state)
	if err != nil {
		t.Fatal(err)
	}
	answers := make(chan Answer, 2)
	unexpected := func(context.Context, Instruction) (map[string]any, error) {
		return nil, errors.New("the relay executed an adopted terminal instruction locally")
	}
	names := []string{"write_keys", "resize", "stream", "snapshot", "signal", "stop", "open_private", "write_private", "close_private"}
	executors := make(map[string]Executor, len(names))
	for _, name := range names {
		executors[name] = unexpected
	}
	secret := []byte("local link test")
	dispatcher := NewDispatcher(Verifier{Secret: secret, Now: time.Now}, record, executors, func(_ Instruction, answer Answer) {
		answers <- answer
	})
	dispatcher.ForwardTerminals(table, func(_ context.Context, submission string) (PrivateValue, error) {
		return PrivateValue{Value: submission}, nil
	})

	for index, name := range names {
		instruction := Instruction{
			ID: fmt.Sprint(index), Sequence: uint64(index + 1), Type: name, ProcessID: "session",
			Payload: `{"submission":"fixture"}`, ExpiresAt: time.Now().Add(time.Minute).UTC().Truncate(time.Second),
		}
		instruction.Signature = Sign(secret, instruction)
		dispatcher.Submit(ctx, instruction)
		kind, body, err := link.Receive()
		if err != nil || kind != LinkInstruction {
			t.Fatalf("received %q with error %v", kind, err)
		}
		read, err := ReadLocalLinkInstruction(body)
		if err != nil || read != instruction {
			t.Fatalf("forwarded instruction = %+v, %v", read, err)
		}
		if name == "write_private" {
			kind, body, err := link.Receive()
			value, decoded := ReadWirePayload[PrivateValue](body)
			if err != nil || decoded != nil || kind != LinkPrivate || value.Value != "fixture" {
				t.Fatal("the private write did not carry the pulled value")
			}
		}
		answer := DoneWith(instruction, nil)
		if err := link.Send(LinkAnswer, answer); err != nil {
			t.Fatal(err)
		}
		if got := <-answers; !reflect.DeepEqual(answer, got) {
			t.Fatalf("answer = %+v, want %+v", got, answer)
		}
	}

	output := Output{
		Frames: []Frame{{Rows: []string{"screen"}, UnchangedMs: []int64{0}}},
		Chunks: []Chunk{{Stream: StandardOutput, Offset: 7, Bytes: base64.StdEncoding.EncodeToString([]byte("out"))}},
	}
	if err := link.Send(LinkOutput, output); err != nil {
		t.Fatal(err)
	}
	select {
	case got := <-posted:
		if !reflect.DeepEqual(output, got) || table.outputs.SpoolOffset("session") != 10 {
			t.Fatalf("output or spool differs: %+v, offset %d", got, table.outputs.SpoolOffset("session"))
		}
	case <-ctx.Done():
		t.Fatal("the terminal output did not reach the journal")
	}
	if err := link.Send(LinkExit, LocalLinkExit{Code: 7, Evidence: "exit"}); err != nil {
		t.Fatal(err)
	}
	waitFor(t, func() bool { return len(table.Live()) == 0 })
	reports := table.reports.Pending()
	if len(reports) != 2 || reports[0].Report != ProcessReportRunning || reports[1].Report != ProcessReportExited ||
		reports[1].ExitCode == nil || *reports[1].ExitCode != 7 {
		t.Fatalf("terminal reports = %+v", reports)
	}
}

func TestTerminalInventorySurvivesRelayRestartAndFencesOlderGenerations(t *testing.T) {
	state, listener := terminalListener(t)
	post := func(string, Output) error { return nil }
	first := terminalTable(t, state, post)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	original, stop := context.WithCancel(ctx)
	defer stop()
	peer := terminalPeer(t, listener, 2)
	if err := first.AdoptTerminals(original); err != nil {
		t.Fatal(err)
	}
	link := <-peer
	defer link.Close()
	stop()
	_, _, _ = link.Receive()

	restarted := terminalTable(t, state, post)
	peer = terminalPeer(t, listener, 1)
	err := restarted.connectTerminal(ctx, TerminalSocket(state, "session"), "session")
	_ = (<-peer).Close()
	var refusal RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != Fenced {
		t.Fatalf("older terminal generation returned %v", err)
	}

	peer = terminalPeer(t, listener, 2)
	if err := restarted.AdoptTerminals(ctx); err != nil {
		t.Fatal(err)
	}
	link = <-peer
	inventory := restarted.Inventory()
	if len(inventory) != 1 || !inventory[0].IsAlive || !inventory[0].IsTerminalHeld || inventory[0].SpoolOffset != 7 {
		t.Fatalf("the first inventory = %+v", inventory)
	}
	_ = link.Close()
	waitFor(t, func() bool { return len(restarted.Live()) == 0 })
	reports := restarted.reports.Pending()
	if len(reports) != 2 || reports[1].Report != ProcessReportLost {
		t.Fatalf("the terminal reports after disconnect = %+v", reports)
	}
}

func terminalListener(t *testing.T) (string, net.Listener) {
	t.Helper()
	state, err := os.MkdirTemp("", "link-")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(state) })
	if err := os.MkdirAll(TerminalSocketFolder(state), 0o700); err != nil {
		t.Fatal(err)
	}
	listener, err := net.Listen("unix", TerminalSocket(state, "session"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = listener.Close() })
	return state, listener
}

func terminalTable(t *testing.T, state string, post OutputPoster) *ProcessTable {
	t.Helper()
	queue, err := OpenReportQueue(state, func(ProcessReport) error { return nil })
	if err != nil {
		t.Fatal(err)
	}
	table := OpenProcessTable(state, host.Containers{}, queue, NewOutputs(state, post))
	if err := table.Adopt(context.Background()); err != nil {
		t.Fatal(err)
	}
	return table
}

func terminalPeer(t *testing.T, listener net.Listener, generation int) <-chan *TerminalLink {
	t.Helper()
	ready := make(chan *TerminalLink, 1)
	go func() {
		defer close(ready)
		connection, err := listener.Accept()
		if err != nil {
			t.Error(err)
			return
		}
		_ = connection.SetDeadline(time.Now().Add(5 * time.Second))
		link := NewTerminalLink(connection)
		if err := link.Send(LinkAdopt, LocalLinkAdopt{
			ProcessID: "session", Generation: generation, Size: TerminalSize{Columns: 80, Rows: 24}, SpoolOffset: 7,
		}); err != nil {
			_ = link.Close()
			t.Error(err)
			return
		}
		ready <- link
	}()
	return ready
}
