package hookadapter

import (
	"context"
	"errors"

	"journal-agent/client"
)

// ErrNoGrant is returned when the call's environment holds no start grant, so nothing may ask the journal.
var ErrNoGrant = errors.New("this session holds no start grant")

// RefuseWithoutGrant answers no call: outside a started session nothing has the authority to ask the journal.
func RefuseWithoutGrant(context.Context, []byte) (Reply, error) {
	return Reply{}, ErrNoGrant
}

// AskJournal sends the native call to the journal itself, signed with the start's grant: the way of a session
// container, which runs no relay. The call is prepared once, so the adapter's second try after a failed send reaches
// the journal as the same call.
func AskJournal(grant client.StartGrant, driver string, generation int) func(context.Context, []byte) (Reply, error) {
	var prepared *client.HookCall

	return func(ctx context.Context, native []byte) (Reply, error) {
		if prepared == nil {
			call, err := grant.PrepareHookCall(driver, generation, native)
			if err != nil {
				return Reply{}, err
			}
			prepared = &call
		}
		answer, err := prepared.Send(ctx)
		if err != nil {
			return Reply{}, err
		}

		return Reply{Stdout: answer.Stdout, Stderr: answer.Stderr, ExitCode: answer.ExitCode}, nil
	}
}
