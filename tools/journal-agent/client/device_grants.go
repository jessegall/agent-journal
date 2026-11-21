package client

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
)

// ErrAwaitingApproval is returned while the owner has not approved a device code yet.
var ErrAwaitingApproval = errors.New("the owner has not approved this device yet")

// DeviceGrantStart is the journal's answer to a shell asking for a device grant: the sign-in's nonsecret reference
// and generation, the device code the shell polls with, the code the owner compares, the approval URL and how often
// to poll.
type DeviceGrantStart struct {
	Reference   string `json:"reference"`
	Generation  int    `json:"generation"`
	DeviceCode  string `json:"deviceCode"`
	UserCode    string `json:"userCode"`
	ApprovalURL string `json:"approvalUrl"`
	ExpiresAt   string `json:"expiresAt"`
	Interval    int    `json:"interval"`
}

// StartDeviceGrant asks, signed by the binding's host, for a device grant the owner approves in the browser. The
// start key names this ask, so a start sent again after a lost reply finds the same grant.
func (client *Client) StartDeviceGrant(ctx context.Context, bindingID string, startKey string) (DeviceGrantStart, error) {
	start := DeviceGrantStart{}
	err := client.call(ctx, "/api/device-grants", map[string]string{"binding": bindingID, "startKey": startKey}, &start)

	return start, err
}

// The outcomes a poll of a device code answers, each with its own status.
const (
	PollPending       = "authorization_pending"
	PollSlowDown      = "slow_down"
	PollExpired       = "expired_token"
	PollIssued        = "issued"
	PollAlreadyIssued = "already_issued"
	PollRevoked       = "revoked"
)

// DevicePoll is one poll's outcome: the word, the grant once issued, the sign-in's reference and the interval a
// slow-down asks for.
type DevicePoll struct {
	Outcome   string
	Grant     string
	Reference string
	Interval  int
}

// PollDeviceGrant answers what the journal says of the device code now; an outcome is never an error, only a call
// that got no outcome is.
func (client *Client) PollDeviceGrant(ctx context.Context, deviceCode string) (DevicePoll, error) {
	answer := struct {
		Outcome string `json:"outcome"`
		Grant   string `json:"grant"`
		Details struct {
			Outcome   string `json:"outcome"`
			Reference string `json:"reference"`
			Interval  int    `json:"interval"`
		} `json:"details"`
		Reference string `json:"reference"`
	}{}
	content, err := json.Marshal(map[string]string{"deviceCode": deviceCode})
	if err != nil {
		return DevicePoll{}, err
	}
	if err := client.sendAnswering(ctx, http.MethodPost, "/api/device-grants/poll", content, &answer); err != nil {
		return DevicePoll{}, err
	}
	if answer.Outcome == "" {
		return DevicePoll{Outcome: answer.Details.Outcome, Reference: answer.Details.Reference,
			Interval: answer.Details.Interval}, nil
	}

	return DevicePoll{Outcome: answer.Outcome, Grant: answer.Grant, Reference: answer.Reference}, nil
}

// RunDeviceCommand runs the verb under a shell user's device grant and hands each frame to write in sequence.
func RunDeviceCommand(
	ctx context.Context,
	transport *http.Client,
	journalURL string,
	grant string,
	command ProjectCommand,
	write func(CommandFrame) error,
) (int, error) {
	content, err := json.Marshal(command)
	if err != nil {
		return 0, err
	}
	request, err := newJSONRequest(ctx, journalURL+"/api/project-commands/device", content)
	if err != nil {
		return 0, err
	}
	request.Header.Set("Authorization", "Bearer "+grant)

	return readFrames(transport, request, write)
}
