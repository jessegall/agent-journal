package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
)

// OutputGrantSource reads a claimed start's sealed output grant snapshot from the journal.
type OutputGrantSource interface {
	OutputGrants(ctx context.Context, startKey string) ([]byte, error)
}

// OutputGrantsName is the file in a runtime's folder that holds its sealed output grants for the relay.
const OutputGrantsName = "output-grants.json"

// RefreshOutputGrants replaces the runtime's snapshot with the journal's current one in one step. When the journal
// cannot give one, the old snapshot is removed: a start then reads none of its saved outputs until it can, and a
// stale grant never lets anything through.
func RefreshOutputGrants(ctx context.Context, source OutputGrantSource, startKey, runtimeFolder string) error {
	path := filepath.Join(runtimeFolder, OutputGrantsName)
	snapshot, err := source.OutputGrants(ctx, startKey)
	if err != nil {
		removed := os.Remove(path)
		if errors.Is(removed, os.ErrNotExist) {
			removed = nil
		}
		return errors.Join(err, removed)
	}
	return writePrivateFile(path, snapshot)
}
