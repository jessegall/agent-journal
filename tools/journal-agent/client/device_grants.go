package client

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
)

// ErrAwaitingApproval is returned while the owner has not approved a device code yet.
var ErrAwaitingApproval = errors.New("the owner has not approved this device yet")

// DeviceGrantStart is the journal's answer to a shell asking for a device grant: the device code the shell polls
// with, the code the owner compares, the approval URL and how often to poll.
type DeviceGrantStart struct {
	DeviceCode  string `json:"deviceCode"`
	UserCode    string `json:"userCode"`
	ApprovalURL string `json:"approvalUrl"`
	ExpiresAt   string `json:"expiresAt"`
	Interval    int    `json:"interval"`
}

// StartDeviceGrant asks, signed by the binding's host, for a device grant the owner approves in the browser.
func (client *Client) StartDeviceGrant(ctx context.Context, bindingID string) (DeviceGrantStart, error) {
	start := DeviceGrantStart{}
	err := client.call(ctx, "/api/device-grants", map[string]string{"binding": bindingID}, &start)

	return start, err
}

// PollDeviceGrant answers the grant once the owner approved the device code; before that it is refused.
func (client *Client) PollDeviceGrant(ctx context.Context, deviceCode string) (string, error) {
	answer := struct {
		Grant string `json:"grant"`
	}{}
	err := client.call(ctx, "/api/device-grants/poll", map[string]string{"deviceCode": deviceCode}, &answer)

	return answer.Grant, err
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

	return streamFrames(transport, request, write)
}
