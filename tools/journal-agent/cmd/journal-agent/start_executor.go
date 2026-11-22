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
	arrangement host.Arrangement
	// bindsAccount asks the agent daemon whether a container binds an account folder; none on a local host, where
	// no container binds one.
	bindsAccount func(ctx context.Context, folder string) (bool, error)
	// accountFolders makes and removes account folders on the agent daemon as root; none on a local host, where the
	// sign-in service makes its folders itself.
	accountFolders accountFolders
	mutex          sync.Mutex
	executions     map[string]execution
}

// execution is one start the executor runs: its driver, the start key its reports carry and its account.
type execution struct {
	runtime   serving.Runtime
	startKey  string
	account   string
	accountID string
}

// belongsTo is whether the execution runs on the account a drain names: by its id on a contained host, by its
// folder on a local one.
func (running execution) belongsTo(request host.DrainRequest, arrangement host.Arrangement) bool {
	if arrangement.IsContained() {
		return running.accountID == request.AccountID
	}

	return running.account == request.Account
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
	if profile, known := profileFor[request.Driver]; known {
		if err := executor.arrangement.AssertContainable(profile.KeepsToolsFromSignIn()); err != nil {
			return host.StartReply{StartID: request.StartID, Refusal: err.Error()}, nil
		}
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
		accountID: prepared.Claim.AccountID,
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
	if executor.arrangement.IsContained() && request.AccountID == "" {
		return host.DrainReply{Reason: "a contained host drains an account by its id, and none was given"}, nil
	}
	executor.mutex.Lock()
	var executionIDs []string
	for executionID, running := range executor.executions {
		if running.belongsTo(request, executor.arrangement) {
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

// FolderUse answers whether a container still binds the account folder, so a displaced folder is deleted only once
// none does; a daemon that cannot be asked counts as binding it.
func (executor *protectedExecutor) FolderUse(ctx context.Context, request host.FolderUseRequest) (host.FolderUseReply, error) {
	if executor.bindsAccount == nil {
		return host.FolderUseReply{}, nil
	}

	bound, err := executor.bindsAccount(ctx, request.Folder)
	if err != nil {
		return host.FolderUseReply{Bound: true, Reason: "the agent daemon could not be asked: " + err.Error()}, nil
	}

	return host.FolderUseReply{Bound: bound}, nil
}

// accountFolders is the agent daemon's side of an account folder: made and removed by root.
type accountFolders interface {
	MakeAccountFolder(ctx context.Context, accountID, operation string) error
	RemoveAccountFolder(ctx context.Context, accountID string) error
}

// errNoAccountFolders refuses a folder request on a host whose agents do not run in containers.
const errNoAccountFolders = "this host runs no containers, so the sign-in service makes its folders itself"

// MakeFolder makes the account's folder on the agent daemon, owned by the program's user.
func (executor *protectedExecutor) MakeFolder(ctx context.Context, request host.AccountFolderRequest) (host.AccountFolderReply, error) {
	if executor.accountFolders == nil {
		return host.AccountFolderReply{Reason: errNoAccountFolders}, nil
	}

	if err := executor.accountFolders.MakeAccountFolder(ctx, request.Folder, request.Operation); err != nil {
		return host.AccountFolderReply{Reason: err.Error()}, nil
	}

	return host.AccountFolderReply{IsDone: true}, nil
}

// RemoveFolder removes the account's folder on the agent daemon.
func (executor *protectedExecutor) RemoveFolder(ctx context.Context, request host.AccountFolderRequest) (host.AccountFolderReply, error) {
	if executor.accountFolders == nil {
		return host.AccountFolderReply{Reason: errNoAccountFolders}, nil
	}

	if err := executor.accountFolders.RemoveAccountFolder(ctx, request.Folder); err != nil {
		return host.AccountFolderReply{Reason: err.Error()}, nil
	}

	return host.AccountFolderReply{IsDone: true}, nil
}

// report queues the report and sends what is queued; what the journal does not acknowledge now is sent later.
func (executor *protectedExecutor) report(ctx context.Context, report host.StartReport) {
	if executor.reports.Queue(report) == nil {
		_ = executor.reports.Send(ctx, executor.reporter)
	}
}
