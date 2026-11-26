package client

import (
	"context"
	"errors"
)

// ErrProtocolRefused is the journal's answer that it does not take this host's protocol: the host must be updated.
var ErrProtocolRefused = errors.New("the journal does not take this host's protocol: update the host")

// Call makes a signed POST of the body to the journal's target and reads its answer into answer, when given.
func (client *Client) Call(ctx context.Context, target string, body any, answer any) error {
	return client.call(ctx, target, body, answer)
}
