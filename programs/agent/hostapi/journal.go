package hostapi

import (
	"context"
	"errors"
	"time"

	"journal-agent/client"
)

// AnswerUntilTaken sends the order's answer and, while the journal may not have received it, sends it again after
// each wait until the journal takes it, refuses it, the order expires or the host stops; it answers whether the journal
// took it. The journal answers a repeated answer as it did the first, so sending twice is safe.
func (journal Journal) AnswerUntilTaken(ctx context.Context, answer Answer, wait time.Duration, expires time.Time) error {
	for {
		err := journal.AnswerOrder(ctx, answer.OrderID, answer)
		if err == nil || !errors.Is(err, client.ErrUncertain) || !time.Now().Add(wait).Before(expires) {
			return err
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(wait):
		}
	}
}
