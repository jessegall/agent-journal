package lease

import (
	"context"
	"time"
)

// RenewEvery is how often a runtime's lease is renewed: a third of the minute the journal grants, so two renewals
// may fail before the lease ends.
const RenewEvery = 20 * time.Second

// checkEvery is how often the supervisor looks whether the lease has ended between renewals.
const checkEvery = time.Second

// Renewal asks the journal for one more lease and answers the server's time and the lease's end; an error is a
// refused or failed renewal, which never extends the lease.
type Renewal func(ctx context.Context) (serverTime time.Time, expiresAt time.Time, err error)

// Keep renews the lease every interval and stops the runtime once it ends: at once when the first renewal fails, as
// a runtime has no authority before its first lease. It returns when the runtime is stopped or the context ends.
func (supervisor *Supervisor) Keep(ctx context.Context, renew Renewal, every time.Duration) {
	renewals := time.NewTicker(every)
	defer renewals.Stop()
	checks := time.NewTicker(checkEvery)
	defer checks.Stop()

	supervisor.renewOnce(ctx, renew)
	for supervisor.Check(time.Now()) {
		select {
		case <-ctx.Done():
			return
		case <-renewals.C:
			supervisor.renewOnce(ctx, renew)
		case <-checks.C:
		}
	}
}

// renewOnce keeps a successful renewal, counted from when its request started.
func (supervisor *Supervisor) renewOnce(ctx context.Context, renew Renewal) {
	started := time.Now()
	serverTime, expiresAt, err := renew(ctx)
	if err != nil {
		return
	}

	supervisor.Renew(Renewed(started, serverTime, expiresAt))
}
