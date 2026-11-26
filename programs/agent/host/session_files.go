package host

import (
	"archive/tar"
	"bytes"
	"context"
	"errors"
	"fmt"
	"path"
	"regexp"
	"strings"

	"github.com/moby/moby/api/types/mount"
)

// plainSessionID is a session's id as the journal makes it: lowercase letters and digits, nothing else.
var plainSessionID = regexp.MustCompile(`^[a-z0-9]+$`)

// ErrSessionFilesUnsafe is a session id or file path that would write outside the session's own folder.
var ErrSessionFilesUnsafe = errors.New("the session files would leave the session's folder")

// RemoveSessionFiles removes the session's own folder of handed files once the session has ended.
func (containers Containers) RemoveSessionFiles(ctx context.Context, sessionID string) error {
	if !plainSessionID.MatchString(sessionID) {
		return fmt.Errorf("%w: %q is not a plain session id", ErrSessionFilesUnsafe, sessionID)
	}

	if output, err := containers.runOnJournalRoot(ctx, `rm -rf -- /journal/sessions/`+sessionID, nil); err != nil {
		return fmt.Errorf("removing the session files failed: %w: %s", err, output)
	}

	return nil
}

// PlanFile is one file a plan hands its process, named relative to the process's files folder.
type PlanFile struct {
	Name    string
	Content string
}

// SessionFilesFolder is the folder on the agent daemon that holds one process's plan files, which its container
// mounts read-only.
func SessionFilesFolder(sessionID, processID string) string {
	return journalRoot + "/sessions/" + sessionID + "/" + processID + "/files"
}

// WritePlanFiles writes a process's plan files into its folder of the session on the agent daemon, owned by root and
// readable by every user, so the container reads them and changes none.
func (containers Containers) WritePlanFiles(ctx context.Context, sessionID, processID string, files []PlanFile) error {
	if !plainSessionID.MatchString(sessionID) || !plainSessionID.MatchString(processID) {
		return fmt.Errorf("%w: %q or %q is not a plain id", ErrSessionFilesUnsafe, sessionID, processID)
	}

	archive, err := planFilesArchive(files)
	if err != nil {
		return err
	}

	folder := "/journal/sessions/" + sessionID + "/" + processID + "/files"
	script := `rm -rf -- ` + folder + ` && mkdir -p -- ` + folder + ` && tar -x -o -C ` + folder +
		` && chmod -R u=rwX,go=rX -- /journal/sessions/` + sessionID
	if output, err := containers.runOnJournalRoot(ctx, script, archive); err != nil {
		return fmt.Errorf("writing the plan files failed: %w: %s", err, output)
	}

	return nil
}

// planFilesArchive is the files as a tar, each name clean and inside the folder.
func planFilesArchive(files []PlanFile) ([]byte, error) {
	var archive bytes.Buffer
	writer := tar.NewWriter(&archive)
	for _, file := range files {
		if path.IsAbs(file.Name) || path.Clean(file.Name) != file.Name || file.Name == ".." ||
			strings.HasPrefix(file.Name, "../") {
			return nil, fmt.Errorf("%w: %q", ErrSessionFilesUnsafe, file.Name)
		}
		header := &tar.Header{Name: file.Name, Mode: 0o644, Size: int64(len(file.Content)), Typeflag: tar.TypeReg}
		if err := writer.WriteHeader(header); err != nil {
			return nil, err
		}
		if _, err := writer.Write([]byte(file.Content)); err != nil {
			return nil, err
		}
	}
	if err := writer.Close(); err != nil {
		return nil, err
	}

	return archive.Bytes(), nil
}

// runOnJournalRoot runs a shell script in the agent image as root, with no network and only the daemon's journal
// folder mounted, where the sessions' folders live; input is what the script reads on its standard input, or nil.
func (containers Containers) runOnJournalRoot(ctx context.Context, script string, input []byte) (string, error) {
	return containers.runToEnd(ctx, throwaway{
		User:         "0:0",
		Program:      "sh",
		Arguments:    []string{"-c", script},
		Mounts:       []mount.Mount{bindMount(journalRoot, "/journal", true)},
		Capabilities: accountFolderCapabilities,
		Input:        input,
	})
}
