package client

import "context"

// StopConditionRun mirrors App\Http\Data\Hooks\StopConditionRunData: one frozen stop condition as the host runs it,
// an absolute executable with argv, never a shell line.
type StopConditionRun struct {
	Key            string   `json:"key"`
	DefinitionHash string   `json:"definition_hash"`
	Executable     string   `json:"executable"`
	Arguments      []string `json:"arguments"`
	Directory      string   `json:"directory"`
	TimeoutSeconds int      `json:"timeout_seconds"`
	OutputBytes    int      `json:"output_bytes"`
}

// PendingStopAttempt mirrors App\Http\Data\Hooks\PendingStopAttemptData: a stop of one of this host's sessions whose
// conditions wait for the host, in declaration order.
type PendingStopAttempt struct {
	ID                  string             `json:"id"`
	SessionID           string             `json:"session_id"`
	PolicyDigest        string             `json:"policy_digest"`
	WorkspaceGeneration int                `json:"workspace_generation"`
	AttemptSeconds      int                `json:"attempt_seconds"`
	Conditions          []StopConditionRun `json:"conditions"`
}

// StopConditionResult is what the host reports for one condition it ran; an unknown exit code stays nil.
type StopConditionResult struct {
	ConditionKey   string  `json:"condition_key"`
	DefinitionHash string  `json:"definition_hash"`
	Status         string  `json:"status"`
	StartedAt      string  `json:"started_at"`
	EndedAt        *string `json:"ended_at"`
	ExitCode       *int    `json:"exit_code"`
	Signal         *string `json:"signal"`
	Summary        string  `json:"summary"`
	Output         *string `json:"output"`
	IsTruncated      bool    `json:"is_truncated"`
}

// PendingStopAttempts lists the stop attempts of this host's sessions that wait for their conditions to run.
func (client *Client) PendingStopAttempts(ctx context.Context) ([]PendingStopAttempt, error) {
	var answer struct {
		Attempts []PendingStopAttempt `json:"attempts"`
	}
	return answer.Attempts, client.read(ctx, "/host/stop-attempts", &answer)
}

// NotifyStopResults submits every result of one attempt at once and answers the state they settled it in.
func (client *Client) NotifyStopResults(
	ctx context.Context,
	attempt PendingStopAttempt,
	results []StopConditionResult,
) (string, error) {
	var answer struct {
		State string `json:"state"`
	}
	body := map[string]any{
		"policy_digest":        attempt.PolicyDigest,
		"workspace_generation": attempt.WorkspaceGeneration,
		"results":              results,
	}
	return answer.State, client.call(ctx, "/host/stop-attempts/"+attempt.ID+"/results", body, &answer)
}
