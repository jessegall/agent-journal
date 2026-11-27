package hostapi

import (
	"context"
)

// errNoAccountFolders refuses a folder instruction on a host whose agents do not run in containers.
const errNoAccountFolders = "this host runs no containers, so the sign-in service makes its folders itself"

// MakeFolder makes the account's folder on the agent daemon as root, owned by the program's user.
func (table *ProcessTable) MakeFolder(ctx context.Context, _ Instruction, plan FolderPlan) (Empty, error) {
	if table.containers.Daemon == nil {
		return Empty{}, RefusalError{Refusal: Unsafe, Reason: errNoAccountFolders}
	}
	if err := table.containers.MakeAccountFolder(ctx, plan.Folder, plan.Operation); err != nil {
		return Empty{}, RefusalError{Refusal: Unsafe, Reason: err.Error()}
	}

	return Empty{}, nil
}

// RemoveFolder removes the account's folder on the agent daemon.
func (table *ProcessTable) RemoveFolder(ctx context.Context, _ Instruction, plan FolderPlan) (Empty, error) {
	if table.containers.Daemon == nil {
		return Empty{}, RefusalError{Refusal: Unsafe, Reason: errNoAccountFolders}
	}
	if err := table.containers.RemoveAccountFolder(ctx, plan.Folder); err != nil {
		return Empty{}, RefusalError{Refusal: Unsafe, Reason: err.Error()}
	}

	return Empty{}, nil
}

// FolderUse answers whether a container still binds the account folder, so a displaced folder is removed only once
// none does; a daemon that cannot be asked counts as binding it, and a host with no daemon binds none.
func (table *ProcessTable) FolderUse(ctx context.Context, instruction Instruction, plan FolderPlan) (FolderUseReply, error) {
	if table.containers.Daemon == nil {
		return FolderUseReply{IsBound: false}, nil
	}
	bound, err := table.containers.BindsAccount(ctx, plan.Folder)
	if err != nil {
		return FolderUseReply{IsBound: true, Reason: "the agent daemon could not be asked: " + err.Error()}, nil
	}

	return FolderUseReply{IsBound: bound}, nil
}
