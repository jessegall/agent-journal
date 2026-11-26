package hostapi

import (
	"context"
)

// errNoAccountFolders refuses a folder order on a host whose agents do not run in containers.
const errNoAccountFolders = "this host runs no containers, so the sign-in service makes its folders itself"

// FolderPlan is the payload of make_folder, remove_folder and folder_use: the account folder by its plain account id
// and the sign-in operation that asked.
type FolderPlan struct {
	Folder    string `json:"folder"`
	Operation string `json:"operation"`
}

// makeFolder makes the account's folder on the agent daemon as root, owned by the program's user.
func (table *ProcessTable) makeFolder(ctx context.Context, order Order) (map[string]any, error) {
	plan, err := table.folderPlan(order)
	if err != nil {
		return nil, err
	}
	if err := table.containers.MakeAccountFolder(ctx, plan.Folder, plan.Operation); err != nil {
		return nil, RefusalError{Refusal: Unsafe, Reason: err.Error()}
	}

	return map[string]any{}, nil
}

// removeFolder removes the account's folder on the agent daemon.
func (table *ProcessTable) removeFolder(ctx context.Context, order Order) (map[string]any, error) {
	plan, err := table.folderPlan(order)
	if err != nil {
		return nil, err
	}
	if err := table.containers.RemoveAccountFolder(ctx, plan.Folder); err != nil {
		return nil, RefusalError{Refusal: Unsafe, Reason: err.Error()}
	}

	return map[string]any{}, nil
}

// folderUse answers whether a container still binds the account folder, so a displaced folder is removed only once
// none does; a daemon that cannot be asked counts as binding it, and a host with no daemon binds none.
func (table *ProcessTable) folderUse(ctx context.Context, order Order) (map[string]any, error) {
	plan, err := decodePayload[FolderPlan](order)
	if err != nil {
		return nil, err
	}
	if table.containers.Daemon == nil {
		return map[string]any{"is_bound": false}, nil
	}
	bound, err := table.containers.BindsAccount(ctx, plan.Folder)
	if err != nil {
		return map[string]any{"is_bound": true, "reason": "the agent daemon could not be asked: " + err.Error()}, nil
	}

	return map[string]any{"is_bound": bound}, nil
}

// folderPlan reads a folder order's payload, refused on a host with no agent daemon.
func (table *ProcessTable) folderPlan(order Order) (FolderPlan, error) {
	if table.containers.Daemon == nil {
		return FolderPlan{}, RefusalError{Refusal: Unsafe, Reason: errNoAccountFolders}
	}

	return decodePayload[FolderPlan](order)
}
