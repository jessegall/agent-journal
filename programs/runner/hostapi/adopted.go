package hostapi

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"net"
	"os"
	"path/filepath"
	"strings"
	"time"

	"journal-runner/localsocket"
)

const terminalSocketSuffix = ".sock"
const terminalSocketCheck = 250 * time.Millisecond
const terminalHelloLimit = time.Second

type adoptedTerminal struct {
	link        *TerminalLink
	answers     chan LocalLinkAnswer
	spoolOffset int64
}

func TerminalSocketFolder(relayFolder string) string {
	return filepath.Join(relayFolder, "terminals")
}

func TerminalSocket(relayFolder, processID string) string {
	return filepath.Join(TerminalSocketFolder(relayFolder), processID+terminalSocketSuffix)
}

// AdoptTerminals finds local terminal sockets before the relay sends inventory.
func (table *ProcessTable) AdoptTerminals(ctx context.Context) error {
	folder := TerminalSocketFolder(table.stateFolder)
	if err := os.MkdirAll(folder, 0o700); err != nil {
		return err
	}
	entries, err := os.ReadDir(folder)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		id, socket := strings.CutSuffix(entry.Name(), terminalSocketSuffix)
		if !socket || entry.Type()&fs.ModeSocket == 0 || table.hasLiveProcess(id) {
			continue
		}
		if err := table.connectTerminal(ctx, TerminalSocket(table.stateFolder, id), id); err != nil {
			// A socket left behind by a terminal that already ended does not stop the relay.
			continue
		}
	}
	return nil
}

// WatchTerminals takes in terminals that appear after the first inventory.
func (table *ProcessTable) WatchTerminals(ctx context.Context) {
	ticker := time.NewTicker(terminalSocketCheck)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			_ = table.AdoptTerminals(ctx)
		}
	}
}

func (table *ProcessTable) hasLiveProcess(id string) bool {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	process := table.processes[id]
	if process == nil {
		return false
	}
	select {
	case <-process.exited:
		return false
	default:
		return true
	}
}

func (table *ProcessTable) connectTerminal(ctx context.Context, socket, expectedID string) error {
	connection, err := localsocket.Dial(ctx, net.Dialer{Timeout: terminalHelloLimit}, socket)
	if err != nil {
		return err
	}
	link := NewTerminalLink(connection)
	stopOnCancel := context.AfterFunc(ctx, func() { _ = link.Close() })
	owned := false
	defer func() {
		if !owned {
			stopOnCancel()
			_ = link.Close()
		}
	}()
	if err := connection.SetReadDeadline(time.Now().Add(terminalHelloLimit)); err != nil {
		return err
	}
	message, body, err := link.Receive()
	if err != nil {
		return err
	}
	if message != LinkAdopt {
		return errors.New("the terminal link must begin with adoption")
	}
	adopt, err := ReadLocalLinkAdopt(body)
	if err != nil {
		return err
	}
	if adopt.ProcessID != expectedID || adopt.Generation < 1 || adopt.SpoolOffset < 0 {
		return errors.New("the terminal adoption does not match the socket's process")
	}
	if err := connection.SetReadDeadline(time.Time{}); err != nil {
		return err
	}
	process, err := table.holdTerminal(adopt, link)
	if err != nil {
		return err
	}
	owned = true
	go func() {
		defer stopOnCancel()
		table.readTerminal(ctx, process)
	}()
	return nil
}

func (table *ProcessTable) holdTerminal(adopt LocalLinkAdopt, link *TerminalLink) (*heldProcess, error) {
	table.mutex.Lock()
	defer table.mutex.Unlock()
	id := adopt.ProcessID
	previous := table.terminalGenerations[id]
	if adopt.Generation < previous {
		return nil, RefusalError{Refusal: Fenced, Reason: "the terminal's generation is older than the relay's"}
	}
	if current := table.processes[id]; current != nil {
		select {
		case <-current.exited:
		default:
			return nil, RefusalError{Refusal: Fenced, Reason: "the relay already holds this process"}
		}
	}
	if err := table.outputs.openAdopted(id); err != nil {
		return nil, err
	}
	process := &heldProcess{
		id: id, plan: OpenPlan{Type: "terminal", Size: adopt.Size},
		generation: adopt.Generation, identity: "terminal:" + id, exited: make(chan struct{}),
		adopted: &adoptedTerminal{link: link, answers: make(chan LocalLinkAnswer, 1), spoolOffset: adopt.SpoolOffset},
	}
	if previous != adopt.Generation {
		if err := table.reports.Add(ProcessReport{
			ProcessID: id, Report: ProcessReportRunning, Identity: process.identity, Generation: adopt.Generation,
		}); err != nil {
			return nil, err
		}
	}
	table.processes[id] = process
	table.terminalGenerations[id] = adopt.Generation
	table.writeKept(nil)
	return process, nil
}

func (table *ProcessTable) readTerminal(ctx context.Context, process *heldProcess) {
	terminal := process.adopted
	defer close(terminal.answers)
	defer terminal.link.Close()
	report, err := table.terminalReport(process)
	if ctx.Err() != nil {
		return
	}
	if err != nil {
		report = ProcessReport{ProcessID: process.id, Report: ProcessReportLost, Evidence: "the terminal socket closed without an exit"}
	}
	table.end(process, report)
}

func (table *ProcessTable) terminalReport(process *heldProcess) (ProcessReport, error) {
	terminal := process.adopted
	for {
		message, body, err := terminal.link.Receive()
		if err != nil {
			return ProcessReport{}, err
		}
		switch message {
		case LinkAnswer:
			answer, err := ReadLocalLinkAnswer(body)
			if err != nil {
				return ProcessReport{}, err
			}
			select {
			case terminal.answers <- answer:
			default:
				return ProcessReport{}, errors.New("the terminal sent two answers to one instruction")
			}
		case LinkOutput:
			output, err := ReadLocalLinkOutput(body)
			if err != nil {
				return ProcessReport{}, err
			}
			if err := table.outputs.acceptAdopted(process.id, output); err != nil {
				return ProcessReport{}, err
			}
		case LinkExit:
			exit, err := ReadLocalLinkExit(body)
			if err != nil {
				return ProcessReport{}, err
			}
			return ProcessReport{ProcessID: process.id, Report: ProcessReportExited, ExitCode: &exit.Code, Evidence: exit.Evidence}, nil
		default:
			return ProcessReport{}, fmt.Errorf("unexpected message on the terminal link: %s", message)
		}
	}
}

func (table *ProcessTable) forwardTerminal(ctx context.Context, instruction Instruction, pull PrivateValuePuller) (Answer, bool) {
	switch instruction.Type {
	case "write_keys", "resize", "stream", "snapshot", "signal", "stop", "open_private", "write_private", "close_private":
	default:
		return Answer{}, false
	}
	process, err := table.held(instruction.ProcessID)
	if err != nil || process.adopted == nil {
		return Answer{}, false
	}
	answer, err := process.adopted.forward(ctx, instruction, pull)
	if err != nil {
		return refusalAnswer(instruction, err, nil), true
	}
	return answer, true
}

func (terminal *adoptedTerminal) forward(ctx context.Context, instruction Instruction, pull PrivateValuePuller) (Answer, error) {
	var private *PrivateValue
	if instruction.Type == "write_private" {
		write, err := DecodePayload[PrivateWrite](instruction)
		if err != nil {
			return Answer{}, err
		}
		value, err := pull(ctx, write.Submission)
		if err != nil {
			return Answer{}, err
		}
		private = &value
	}
	disconnected := RefusalError{Refusal: NotRunning, Reason: "the terminal is no longer connected"}
	if err := terminal.link.Send(LinkInstruction, instruction); err != nil {
		return Answer{}, disconnected
	}
	if private != nil {
		if err := terminal.link.Send(LinkPrivate, *private); err != nil {
			return Answer{}, disconnected
		}
	}
	select {
	case <-ctx.Done():
		return Answer{}, ctx.Err()
	case answer, connected := <-terminal.answers:
		if !connected {
			return Answer{}, disconnected
		}
		if answer.InstructionID != instruction.ID || !answer.Status.IsKnown() {
			_ = terminal.link.Close()
			return Answer{}, RefusalError{Refusal: Unsafe, Reason: "the terminal answered another instruction or used an unknown status"}
		}
		return answer, nil
	}
}
