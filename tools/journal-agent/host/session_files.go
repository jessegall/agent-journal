package host

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"path"
	"regexp"
	"strings"

	"github.com/moby/moby/api/types/mount"

	"journal-agent/client"
	"journal-agent/shellwords"
)

// SessionFilesTarget is where a contained session finds the files its start hands it, such as its skills: the
// session's own folder on the agent daemon, mounted read-only under /tmp, the one folder outside the workspace its
// program's file tools may read.
const SessionFilesTarget = "/tmp/journal-session"

// plainSessionID is a session's id as the journal makes it: lowercase letters and digits, nothing else.
var plainSessionID = regexp.MustCompile(`^[a-z0-9]+$`)

// ErrSessionFilesUnsafe is a session id or file path that would write outside the session's own folder.
var ErrSessionFilesUnsafe = errors.New("the session files would leave the session's folder")

// WriteSessionFiles writes the folders a start's grant names into the session's own folder on the agent daemon,
// replacing what an earlier start wrote, so every creation of the session's container finds the current files.
// Files are readable by every user of the container and owned by root, so the program reads them and changes none.
func (containers Containers) WriteSessionFiles(
	ctx context.Context,
	sessionID string,
	folders []client.StartFolder,
) error {
	if !plainSessionID.MatchString(sessionID) {
		return fmt.Errorf("%w: %q is not a plain session id", ErrSessionFilesUnsafe, sessionID)
	}

	folder := "/journal/sessions/" + sessionID
	lines := []string{"set -e", `rm -rf -- "` + folder + `"`, `mkdir -p -m 0755 "` + folder + `"`}
	for _, start := range folders {
		for _, file := range start.Files {
			relative := path.Join(start.Name, file.Path)
			if err := checkInside(relative); err != nil {
				return fmt.Errorf("%w: %s", ErrSessionFilesUnsafe, err)
			}
			target := folder + "/" + relative
			lines = append(lines,
				`mkdir -p -m 0755 "`+path.Dir(target)+`"`,
				"printf %s "+shellwords.Quoted(base64.StdEncoding.EncodeToString([]byte(file.Content)))+
					` | base64 -d > "`+target+`"`,
				`chmod 0644 "`+target+`"`,
			)
		}
	}

	if output, err := containers.runOnJournalRoot(ctx, strings.Join(lines, "\n")); err != nil {
		return fmt.Errorf("writing the session files failed: %w: %s", err, output)
	}

	return nil
}

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
