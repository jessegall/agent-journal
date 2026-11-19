package client

import "context"

// OutputGrants reads the current output grant snapshot of a start this host claimed, exactly as the journal sealed
// it, for the relay to verify.
func (client *Client) OutputGrants(ctx context.Context, startKey string) ([]byte, error) {
	var snapshot jsonBytes
	return snapshot, client.read(ctx, "/host/starts/"+startKey+"/outputs", &snapshot)
}

// jsonBytes keeps a JSON answer as the journal sent it.
type jsonBytes []byte

func (content *jsonBytes) UnmarshalJSON(data []byte) error {
	*content = append((*content)[:0], data...)
	return nil
}
