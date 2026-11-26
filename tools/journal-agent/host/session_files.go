package host

import (
	"context"
	"errors"
	"fmt"
	"regexp"

	"github.com/moby/moby/api/types/mount"
)

// SessionFilesTarget is where a contained session finds the files its start hands it, such as its skills: the
// session's own folder on the agent daemon, mounted read-only under /tmp, the one folder outside the workspace its
// program's file tools may read.
const SessionFilesTarget = "/tmp/journal-session"

// ManagedSettingsTarget is where a contained Claude Code reads the managed settings its start hands it: one file of
// the session's own folder, mounted read-only.
const ManagedSettingsTarget = "/etc/claude-code/managed-settings.json"

// plainSessionID is a session's id as the journal makes it: lowercase letters and digits, nothing else.
var plainSessionID = regexp.MustCompile(`^[a-z0-9]+$`)

// ErrSessionFilesUnsafe is a session id or file path that would write outside the session's own folder.
var ErrSessionFilesUnsafe = errors.New("the session files would leave the session's folder")

// RemoveSessionFiles removes the session's own folder of handed files once the session has ended.
func (containers Containers) RemoveSessionFiles(ctx context.Context, sessionID string) error {
	if !plainSessionID.MatchString(sessionID) {
		return fmt.Errorf("%w: %q is not a plain session id", ErrSessionFilesUnsafe, sessionID)
	}

	if output, err := containers.runOnJournalRoot(ctx, `rm -rf -- /journal/sessions/`+sessionID); err != nil {
		return fmt.Errorf("removing the session files failed: %w: %s", err, output)
	}

	return nil
}

// runOnJournalRoot runs a shell script in the agent image as root, with no network and only the daemon's journal
// folder mounted, where the sessions' folders live.
func (containers Containers) runOnJournalRoot(ctx context.Context, script string) (string, error) {
	return containers.runToEnd(ctx, throwaway{
		User:         "0:0",
		Program:      "sh",
		Arguments:    []string{"-c", script},
		Mounts:       []mount.Mount{bindMount(journalRoot, "/journal", true)},
		Capabilities: accountFolderCapabilities,
	})
}
