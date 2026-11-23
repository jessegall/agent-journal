package client

import (
	"context"
	"errors"
	"log"
	"time"
)

const (
	firstBackoff = time.Second
	lastBackoff  = time.Minute
	claimLimit   = 10
	claimWait    = 10
)

// Poll claims requests in a loop until ctx ends, handing each answer to handle when it holds requests or a new
// watched list, and the first answer after the journal was lost, so the watched list is named again. When the
// journal cannot be reached it waits, doubling the wait up to a minute, and starts over at a second after the next
// answer.
func (client *Client) Poll(ctx context.Context, handle func(Claim)) {
	backoff := firstBackoff
	watchedVersion := 0
	lost := false
	for ctx.Err() == nil {
		claimed, err := client.Claim(ctx, claimLimit, claimWait, watchedVersion)
		// A journal that refuses this host for its role refuses every claim alike, so polling stops at once.
		if errors.Is(err, ErrHostRoleRefused) {
			log.Printf("the journal refuses this host for its role, so claiming stops: %v", err)
			return
		}
		if err != nil {
			log.Printf("claim failed, retrying in %s: %v", backoff, err)
			select {
			case <-ctx.Done():
				return
			case <-time.After(backoff):
			}
			backoff = min(backoff*2, lastBackoff)
			lost = true
			continue
		}
		backoff = firstBackoff
		if len(claimed.Requests) > 0 || claimed.WatchedVersion != watchedVersion || lost {
			watchedVersion = claimed.WatchedVersion
			lost = false
			handle(claimed)
		}
	}
}
