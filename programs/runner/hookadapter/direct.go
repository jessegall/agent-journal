package hookadapter

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strconv"

	"journal-runner/client"
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

// InContainer is the adapter of a hook call in a session container: asked of the journal with the start's grant as
// the process generation the start names, answered from the sealed reply file when the journal is away or slow.
func InContainer(grant client.StartGrant, driver string, repliesFile string) Adapter {
	generation, _ := strconv.Atoi(os.Getenv("JOURNAL_PROCESS_GENERATION"))

	return Adapter{
		Ask:             AskJournal(grant, driver, generation),
		RepliesFile:     repliesFile,
		PreparationFile: filepath.Join(os.TempDir(), "journal-hook-"+strconv.Itoa(os.Getuid())+".prepared"),
	}
}
