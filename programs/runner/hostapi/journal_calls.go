package hostapi

import (
	"context"
	"net/url"
	"strconv"
	"strings"

	"journal-runner/client"
)

// The most instructions one claim takes, and the most seconds the journal holds a claim open waiting for one.
const (
	ClaimInstructionLimit     = 50
	ClaimInstructionWaitLimit = 25
)

// Journal makes the host's calls to the journal over its signed client.
type Journal struct {
	Client *client.Client
}

// ClaimInstruction claims the instructions waiting for the host and answers them.
func (journal Journal) ClaimInstruction(ctx context.Context, limit int, wait int) (ClaimedInstructions, error) {
	var reply ClaimedInstructions
	path := "/host/instructions/claim?limit=" + strconv.Itoa(limit) + "&wait=" + strconv.Itoa(wait)

	return reply, journal.Client.Call(ctx, path, nil, &reply)
}

// AnswerInstruction answers one instruction.
func (journal Journal) AnswerInstruction(ctx context.Context, instruction string, body Answer) error {
	return journal.Client.Call(ctx, "/host/instructions/"+url.PathEscape(instruction), body, nil)
}

// PullPrivateValue takes a private value the journal holds for one submission.
func (journal Journal) PullPrivateValue(ctx context.Context, submission string) (PrivateValue, error) {
	var reply PrivateValue

	return reply, journal.Client.Call(ctx, "/host/private-values/"+url.PathEscape(submission), nil, &reply)
}

// NotifyProcessOutput hands the journal what a process printed.
func (journal Journal) NotifyProcessOutput(ctx context.Context, process string, body Output) error {
	return journal.Client.Call(ctx, strings.Replace("/host/processes/{process}/output", "{process}", url.PathEscape(process), 1), body, nil)
}

// NotifyProcessReport tells the journal how a process stands.
func (journal Journal) NotifyProcessReport(ctx context.Context, process string, body ProcessReport) error {
	return journal.Client.Call(ctx, "/host/processes/"+url.PathEscape(process), body, nil)
}

// NotifyInventory tells the journal every process the host holds.
func (journal Journal) NotifyInventory(ctx context.Context, body Inventory) error {
	return journal.Client.Call(ctx, "/host/inventory", body, nil)
}

// NotifyHeartbeat tells the journal the host is there.
func (journal Journal) NotifyHeartbeat(ctx context.Context, body HostHeartbeat) error {
	return journal.Client.Call(ctx, "/host/heartbeat", body, nil)
}

// NotifyProjectRead hands the journal what a read of a connected project found.
func (journal Journal) NotifyProjectRead(ctx context.Context, read string, body client.ProjectReadReport) error {
	return journal.Client.Call(ctx, "/host/reports/project-reads/"+url.PathEscape(read), body, nil)
}
