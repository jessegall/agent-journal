package client

import (
	"context"
	"errors"
)

// StartSetting mirrors App\Agents\Support\StartSetting: one named value of an account start.
type StartSetting struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// AccountRecipe mirrors App\Agents\Support\AccountStartRecipe: what the program's adapter checked for running on a
// saved account. It is never logged: its environment names the account's folder.
type AccountRecipe struct {
	Environment          []StartSetting `json:"environment"`
	EmptyFolderVariables []string       `json:"emptyFolderVariables"`
	RemovedVariables     []string       `json:"removedVariables"`
	StartFlags           []string       `json:"startFlags"`
	AccountSettings      []StartSetting `json:"accountSettings"`
	DriverVersion       string         `json:"driverVersion"`
	BinaryDigest         string         `json:"binaryDigest"`
	Arrangement          string         `json:"arrangement"`
	ProtectionSettings   string         `json:"protectionSettings"`
	TransportProfile     string         `json:"transportProfile"`
	// ReadFiles are the files the host opens for the program to read, the first on descriptor 3, such as a provider
	// token the program reads from a descriptor instead of from its environment.
	ReadFiles []string `json:"readFiles"`
}

// ClaimedStart is the pending account start of a session this host took: its key, the account folder on this host,
// the sign-in generation it runs in and the checked recipe.
type ClaimedStart struct {
	StartKey   string        `json:"start_key"`
	SessionID  string        `json:"session_id"`
	Directory  string        `json:"directory"`
	AccountID  string        `json:"account_id"`
	Generation int           `json:"generation"`
	Recipe     AccountRecipe `json:"recipe"`
	// ConversationTarget is the native conversation the journal chose for a resume, empty for a fresh one. The host
	// resumes it only when its transcript is in this account's folder for the start's own workspace.
	ConversationTarget string `json:"conversation_target"`
}

// ErrIncompleteClaim is returned when a claim's answer lacks its key, folder or recipe: the host never starts a
// program from a partial recipe.
var ErrIncompleteClaim = errors.New("the claimed start is incomplete")

// ClaimStart takes the pending account start of a session whose runtime is assigned to this host. ErrAlreadyGranted
// means it was taken, cancelled or its session ended; ErrConflict that the program's arrangement is not proven;
// ErrUncertain that the claim may have happened, which only reconciliation settles.
func (client *Client) ClaimStart(ctx context.Context, sessionID string) (ClaimedStart, error) {
	var claimed ClaimedStart
	if err := client.call(ctx, "/host/starts/claim", map[string]string{"session_id": sessionID}, &claimed); err != nil {
		return ClaimedStart{}, err
	}
	if claimed.StartKey == "" || claimed.Directory == "" || claimed.Recipe.DriverVersion == "" ||
		claimed.Recipe.Arrangement == "" {
		return ClaimedStart{}, ErrIncompleteClaim
	}
	return claimed, nil
}

// UnresolvedStarts lists the keys of this host's account starts the journal still counts as possibly running.
func (client *Client) UnresolvedStarts(ctx context.Context) ([]string, error) {
	var answer struct {
		Unresolved []string `json:"unresolved"`
	}
	return answer.Unresolved, client.read(ctx, "/host/starts", &answer)
}

// ReconcileStarts tells the journal which of those starts have no process on this host any more; it answers how
// many accounts that changed.
func (client *Client) ReconcileStarts(ctx context.Context, stopped []string) (int, error) {
	var answer struct {
		AccountsChanged int `json:"accounts_changed"`
	}
	body := map[string][]string{"stopped": stopped}
	return answer.AccountsChanged, client.call(ctx, "/host/starts/reconcile", body, &answer)
}

// ReportRunning reports that a claimed start's program runs, under the host's name for the execution.
func (client *Client) ReportRunning(ctx context.Context, startKey, executionID string) error {
	body := map[string]string{"execution_id": executionID}
	return client.call(ctx, "/host/starts/"+startKey+"/running", body, nil)
}

// ReportStopped reports that a start's program and every process it started have ended.
func (client *Client) ReportStopped(ctx context.Context, startKey string) error {
	return client.call(ctx, "/host/starts/"+startKey+"/stopped", nil, nil)
}

// ReportFailure reports that a start's program failed with one of the journal's named failures, such as
// authentication_failed or rate_limit.
func (client *Client) ReportFailure(ctx context.Context, startKey, failure string) error {
	body := map[string]string{"failure": failure}
	return client.call(ctx, "/host/starts/"+startKey+"/failure", body, nil)
}
