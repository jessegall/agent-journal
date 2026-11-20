package host

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"path/filepath"
	"time"
)

// StartRequest asks the protected host to start one committed start. It names the start, its runtime and session,
// the pinned program and the frozen policy by reference, and the work folder; never a command, an environment or an
// account path, which the host derives itself.
type StartRequest struct {
	StartID          string `json:"startId"`
	RuntimeID        string `json:"runtimeId"`
	SessionID        string `json:"sessionId"`
	Program          string `json:"program"`
	ExecutionMode    string `json:"executionMode"`
	PolicyReference  string `json:"policyReference"`
	Workspace        string `json:"workspace"`
	AccountReference string `json:"accountReference"`
}

// StartReply answers a start request once the program runs: the host's name for the execution and when it began,
// or why the host refused it. A reply never means queued.
type StartReply struct {
	StartID       string    `json:"startId"`
	Execution     string    `json:"execution,omitempty"`
	ExecutionMode string    `json:"executionMode,omitempty"`
	StartedAt     time.Time `json:"startedAt,omitzero"`
	Refusal       string    `json:"refusal,omitempty"`
}

// StopRequest asks the host to end one execution it started.
type StopRequest struct {
	Execution string `json:"execution"`
}

// StopReply answers a stop request once the execution and every process it started have ended: the program's exit
// code when it gave one, or why the host could not end it. A reply never means a signal was only sent.
type StopReply struct {
	Execution string    `json:"execution"`
	ExitCode  *int      `json:"exitCode"`
	EndedAt   time.Time `json:"endedAt,omitzero"`
	Refusal   string    `json:"refusal,omitempty"`
}

// DrainRequest asks the host to end, with proof, the shared owner and every execution of one saved account before
// its sign-in is replaced or removed.
type DrainRequest struct {
	Account string `json:"account"`
}

// DrainReply answers whether nothing of the account runs any more.
type DrainReply struct {
	Drained bool   `json:"drained"`
	Reason  string `json:"reason,omitempty"`
}

// HostRequest is one line the host-local adapters send: one start, stop or drain.
type HostRequest struct {
	Start *StartRequest `json:"start,omitempty"`
	Stop  *StopRequest  `json:"stop,omitempty"`
	Drain *DrainRequest `json:"drain,omitempty"`
}

// Executor starts and stops prepared starts; the protected start service implements it.
type Executor interface {
	Start(ctx context.Context, request StartRequest) (StartReply, error)
	Stop(ctx context.Context, request StopRequest) (StopReply, error)
	Drain(ctx context.Context, request DrainRequest) (DrainReply, error)
}

var (
	// ErrMalformedRequest is returned for a line that is not exactly one complete start or stop.
	ErrMalformedRequest = errors.New("the request is not one complete start or stop")
	executionModes      = map[string]bool{"protected_host": true, "required_container": true}
	startPrograms       = map[string]bool{"claude": true, "codex": true}
)

// Check refuses a start request that misses a field, names an unknown program or mode, or a relative work folder.
func (request StartRequest) Check() error {
	fields := map[string]string{
		"startId": request.StartID, "runtimeId": request.RuntimeID, "sessionId": request.SessionID,
		"policyReference":  request.PolicyReference,
		"accountReference": request.AccountReference,
	}
	for name, value := range fields {
		if value == "" {
			return fmt.Errorf("%w: %s is empty", ErrMalformedRequest, name)
		}
	}
	if !startPrograms[request.Program] {
		return fmt.Errorf("%w: unknown program %q", ErrMalformedRequest, request.Program)
	}
	if !executionModes[request.ExecutionMode] {
		return fmt.Errorf("%w: unknown execution mode %q", ErrMalformedRequest, request.ExecutionMode)
	}
	if !filepath.IsAbs(request.Workspace) || filepath.Clean(request.Workspace) != request.Workspace {
		return fmt.Errorf("%w: the workspace %q is not a clean absolute path", ErrMalformedRequest, request.Workspace)
	}
	return nil
}

// AnswerHostRequest reads one request line, has the executor carry it out and writes its one reply line.
func AnswerHostRequest(ctx context.Context, connection io.ReadWriter, executor Executor) error {
	line, err := bufio.NewReader(io.LimitReader(connection, 64*1024)).ReadBytes('\n')
	if err != nil {
		return err
	}
	var request HostRequest
	if err := json.Unmarshal(line, &request); err != nil {
		return fmt.Errorf("%w: %v", ErrMalformedRequest, err)
	}
	reply, err := request.carryOut(ctx, executor)
	if err != nil {
		return err
	}
	return json.NewEncoder(connection).Encode(reply)
}

// carryOut runs the one operation the request names; a request naming none, or more than one, is malformed.
func (request HostRequest) carryOut(ctx context.Context, executor Executor) (any, error) {
	switch {
	case request.isDrain():
		return executor.Drain(ctx, *request.Drain)
	case request.isStart():
		if err := request.Start.Check(); err != nil {
			return StartReply{StartID: request.Start.StartID, Refusal: err.Error()}, nil
		}
		return executor.Start(ctx, *request.Start)
	case request.isStop():
		return executor.Stop(ctx, *request.Stop)
	default:
		return nil, ErrMalformedRequest
	}
}

// isDrain is whether the request asks only to drain a named account.
func (request HostRequest) isDrain() bool {
	return request.Drain != nil && request.Start == nil && request.Stop == nil && request.Drain.Account != ""
}

// isStart is whether the request asks only for a start.
func (request HostRequest) isStart() bool {
	return request.Start != nil && request.Stop == nil && request.Drain == nil
}

// isStop is whether the request asks only to stop a named execution.
func (request HostRequest) isStop() bool {
	return request.Stop != nil && request.Start == nil && request.Drain == nil && request.Stop.Execution != ""
}
