package main

import (
	"context"
	"errors"
	"strconv"
	"sync"
	"time"

	drivercontracts "journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/serving"
)

// protectedExecutor starts and stops prepared starts for the host-local PHP executor through the same preparation
// and drivers serve uses, and queues each lifecycle report before it is sent.
type protectedExecutor struct {
	preparation host.StartPreparation
	open        serving.Opener
	reports     *host.StartReports
	reporter    host.StartReporter
	codexOwners *host.CodexOwners
	mutex       sync.Mutex
	executions  map[string]execution
}

// execution is one start the executor runs: its driver, the start key its reports carry and its account.
type execution struct {
	runtime  serving.Runtime
	startKey string
	account  string
}

// drainBound is how long a drain waits for each owner and execution of the account to be proven ended.
const drainBound = 10 * time.Second

// errStopUnconfirmed answers a stop whose group could not be proven gone: the obligation to end it stays.
var errStopUnconfirmed = errors.New("the execution could not be proven ended")

func (executor *protectedExecutor) Start(ctx context.Context, request host.StartRequest) (host.StartReply, error) {
	if request.ExecutionMode == "required_container" {
		refusal := host.RequireContainerTransport(request.AccountReference)
		return host.StartReply{StartID: request.StartID, Refusal: refusal.Error()}, nil
	}
	prepared, err := executor.preparation.Prepare(ctx, request.RuntimeID)
	if err != nil {
		return host.StartReply{StartID: request.StartID, Refusal: err.Error()}, nil
	}
	runtime, err := executor.open(request.RuntimeID, prepared)
	if err != nil {
		return host.StartReply{StartID: request.StartID, Refusal: err.Error()}, nil
	}
	executionID := request.RuntimeID + ":" + strconv.Itoa(runtime.Generation())
	executor.mutex.Lock()
	if executor.executions == nil {
		executor.executions = map[string]execution{}
	}
	executor.executions[executionID] = execution{
		runtime: runtime, startKey: prepared.Claim.StartKey, account: prepared.Claim.Directory,
	}
	executor.mutex.Unlock()
	executor.report(ctx, host.StartReport{
		StartKey: prepared.Claim.StartKey, Kind: host.ReportRunning, Execution: executionID,
	})
	return host.StartReply{
		StartID: request.StartID, Execution: executionID, ExecutionMode: request.ExecutionMode,
		StartedAt: time.Now().UTC(),
	}, nil
}

func (executor *protectedExecutor) Stop(ctx context.Context, request host.StopRequest) (host.StopReply, error) {
	executor.mutex.Lock()
	running, found := executor.executions[request.Execution]
	executor.mutex.Unlock()
	if !found {
		return host.StopReply{Execution: request.Execution, Refusal: "this host runs no such execution"}, nil
	}
	result, err := running.runtime.Stop(ctx, drivercontracts.StopRequest{})
	if err != nil || result.Outcome != drivercontracts.OutcomeConfirmed {
		return host.StopReply{Execution: request.Execution, Refusal: errors.Join(errStopUnconfirmed, err).Error()},
			nil
	}
	executor.mutex.Lock()
	delete(executor.executions, request.Execution)
	executor.mutex.Unlock()
	executor.report(ctx, host.StartReport{StartKey: running.startKey, Kind: host.ReportStopped})
	return host.StopReply{Execution: request.Execution, EndedAt: time.Now().UTC()}, nil
}

// Drain ends every execution this executor runs on the account and the account's shared owner, each with proof,
// and answers drained only when all of them are gone. Runtimes serve opened from claimed requests end through the
// journal's own stop requests before maintenance claims the account.
func (executor *protectedExecutor) Drain(ctx context.Context, request host.DrainRequest) (host.DrainReply, error) {
	executor.mutex.Lock()
	var executionIDs []string
	for executionID, running := range executor.executions {
		if running.account == request.Account {
			executionIDs = append(executionIDs, executionID)
		}
	}
	executor.mutex.Unlock()
	for _, executionID := range executionIDs {
		reply, err := executor.Stop(ctx, host.StopRequest{Execution: executionID})
		if err != nil || reply.Refusal != "" {
			return host.DrainReply{Reason: "an execution of the account could not be proven ended"}, nil
		}
	}
	if !executor.codexOwners.Drain(request.Account, drainBound) {
		return host.DrainReply{Reason: "the account's Codex app-server could not be proven ended"}, nil
	}
	return host.DrainReply{Drained: true}, nil
}

// report queues the report and sends what is queued; what the journal does not acknowledge now is sent later.
func (executor *protectedExecutor) report(ctx context.Context, report host.StartReport) {
	if executor.reports.Queue(report) == nil {
		_ = executor.reports.Send(ctx, executor.reporter)
	}
}
