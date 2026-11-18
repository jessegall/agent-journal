package client

import (
	"context"
	"log"
	"time"
)

const (
	firstBackoff = time.Second
	lastBackoff  = time.Minute
	claimLimit   = 10
	claimWait    = 10
)

// Poll claims requests in a loop until ctx ends, handing each batch to handle. When the journal cannot be reached
// it waits, doubling the wait up to a minute, and starts over at a second after the next answer.
func (client *Client) Poll(ctx context.Context, handle func([]ClaimedRequest)) {
	backoff := firstBackoff
	for ctx.Err() == nil {
		claimed, err := client.Claim(ctx, claimLimit, claimWait)
		if err != nil {
			log.Printf("claim failed, retrying in %s: %v", backoff, err)
			select {
			case <-ctx.Done():
				return
			case <-time.After(backoff):
			}
			backoff = min(backoff*2, lastBackoff)
			continue
		}
		backoff = firstBackoff
		if len(claimed) > 0 {
			handle(claimed)
		}
	}
}
