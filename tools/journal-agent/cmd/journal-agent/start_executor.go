package main

import (
	"context"

	"journal-agent/host"
)

// accountExecutor answers the sign-in service's account-folder calls over the start socket: whether a container still
// binds an account folder, and making and removing one on the agent daemon.
type accountExecutor struct {
	// bindsAccount asks the agent daemon whether a container binds an account folder; none on a local host, where
	// no container binds one.
	bindsAccount func(ctx context.Context, folder string) (bool, error)
	// accountFolders makes and removes account folders on the agent daemon as root; none on a local host, where the
	// sign-in service makes its folders itself.
	accountFolders accountFolders
}

// FolderUse answers whether a container still binds the account folder, so a displaced folder is deleted only once
// none does; a daemon that cannot be asked counts as binding it.
func (executor *accountExecutor) FolderUse(ctx context.Context, request host.FolderUseRequest) (host.FolderUseReply, error) {
	if executor.bindsAccount == nil {
		return host.FolderUseReply{}, nil
	}

	bound, err := executor.bindsAccount(ctx, request.Folder)
	if err != nil {
		return host.FolderUseReply{IsBound: true, Reason: "the agent daemon could not be asked: " + err.Error()}, nil
	}

	return host.FolderUseReply{IsBound: bound}, nil
}

// accountFolders is the agent daemon's side of an account folder: made and removed by root.
type accountFolders interface {
	MakeAccountFolder(ctx context.Context, accountID, operation string) error
	RemoveAccountFolder(ctx context.Context, accountID string) error
}

// errNoAccountFolders refuses a folder request on a host whose agents do not run in containers.
const errNoAccountFolders = "this host runs no containers, so the sign-in service makes its folders itself"

// MakeFolder makes the account's folder on the agent daemon, owned by the program's user.
func (executor *accountExecutor) MakeFolder(ctx context.Context, request host.AccountFolderRequest) (host.AccountFolderReply, error) {
	if executor.accountFolders == nil {
		return host.AccountFolderReply{Reason: errNoAccountFolders}, nil
	}

	if err := executor.accountFolders.MakeAccountFolder(ctx, request.Folder, request.Operation); err != nil {
		return host.AccountFolderReply{Reason: err.Error()}, nil
	}

	return host.AccountFolderReply{IsDone: true}, nil
}

// RemoveFolder removes the account's folder on the agent daemon.
func (executor *accountExecutor) RemoveFolder(ctx context.Context, request host.AccountFolderRequest) (host.AccountFolderReply, error) {
	if executor.accountFolders == nil {
		return host.AccountFolderReply{Reason: errNoAccountFolders}, nil
	}

	if err := executor.accountFolders.RemoveAccountFolder(ctx, request.Folder); err != nil {
		return host.AccountFolderReply{Reason: err.Error()}, nil
	}

	return host.AccountFolderReply{IsDone: true}, nil
}
