package host

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"unicode/utf8"

	"journal-runner/client"
)

// binaryProbeBytes is how much of a file's start is searched for a NUL byte, the sign of a binary file.
const binaryProbeBytes = 8000

// hiddenFolders are the folders a project read never shows or opens: the journal's own state and git's.
var hiddenFolders = map[string]bool{".journal": true, ".git": true}

// ProjectReader answers the journal's reads of one project's folders and files, confined to the project's root: a path
// that leaves the root, through dot-dot or a symlink, is refused as outside, and nothing it opens is executed.
type ProjectReader struct {
	Root string
}

// Answer reads the folder or file the read names and says what it found, or why it could not read it.
func (reader ProjectReader) Answer(read client.ProjectRead) client.ProjectReadReport {
	if reader.Root == "" {
		return failedRead(client.ProjectReadFailureUnreadable)
	}
	target, failure := reader.resolve(read.Path)
	if failure != "" {
		return failedRead(failure)
	}
	if read.Type == client.ProjectReadDirectory {
		return listFolder(target, read.EntriesLimit)
	}
	return readText(target, read.TextLimit)
}

// resolve turns a path relative to the root into the real path it names, refusing one outside the root or under a
// hidden folder.
func (reader ProjectReader) resolve(path string) (string, client.ProjectReadFailure) {
	if filepath.IsAbs(path) {
		return "", client.ProjectReadFailureOutside
	}
	relative := filepath.Clean(path)
	if leavesRoot(relative) || isHidden(relative) {
		return "", client.ProjectReadFailureOutside
	}
	root, err := filepath.EvalSymlinks(reader.Root)
	if err != nil {
		return "", client.ProjectReadFailureUnreadable
	}
	resolved, err := filepath.EvalSymlinks(filepath.Join(root, relative))
	if errors.Is(err, fs.ErrNotExist) {
		return "", client.ProjectReadFailureMissing
	}
	if err != nil {
		return "", client.ProjectReadFailureUnreadable
	}
	within, err := filepath.Rel(root, resolved)
	if err != nil || leavesRoot(within) || isHidden(within) {
		return "", client.ProjectReadFailureOutside
	}
	return resolved, ""
}

// listFolder lists a folder's own entries, folders first and each group by name, at most limit of them.
func listFolder(folder string, limit int) client.ProjectReadReport {
	info, err := os.Stat(folder)
	if err != nil {
		return failedRead(client.ProjectReadFailureUnreadable)
	}
	if !info.IsDir() {
		return failedRead(client.ProjectReadFailureNotADirectory)
	}
	found, err := os.ReadDir(folder)
	if err != nil {
		return failedRead(client.ProjectReadFailureUnreadable)
	}
	entries := make([]client.ProjectEntry, 0, len(found))
	for _, item := range found {
		if hiddenFolders[item.Name()] {
			continue
		}
		entries = append(entries, entryOf(folder, item))
	}
	sort.Slice(entries, func(left, right int) bool {
		if entries[left].IsFolder != entries[right].IsFolder {
			return entries[left].IsFolder
		}
		return entries[left].Name < entries[right].Name
	})
	report := client.ProjectReadReport{Entries: entries}
	if len(entries) > limit {
		report.Entries = entries[:limit]
		report.Truncated = true
	}
	return report
}

// entryOf is one folder entry with whether it is a folder and its size, a symlink taken as what it points at.
func entryOf(folder string, item fs.DirEntry) client.ProjectEntry {
	info, err := os.Stat(filepath.Join(folder, item.Name()))
	if err != nil {
		return client.ProjectEntry{Name: item.Name()}
	}
	if info.IsDir() {
		return client.ProjectEntry{Name: item.Name(), IsFolder: true}
	}
	return client.ProjectEntry{Name: item.Name(), Size: info.Size()}
}

// readText reads at most limit bytes of a file as text, cut at a rune boundary, with the digest of the bytes read and
// the size of the whole file; a file with a NUL byte near its start or bytes that are not UTF-8 is binary.
func readText(path string, limit int) client.ProjectReadReport {
	info, err := os.Stat(path)
	if err != nil {
		return failedRead(client.ProjectReadFailureUnreadable)
	}
	if info.IsDir() {
		return failedRead(client.ProjectReadFailureNotAFile)
	}
	file, err := os.OpenFile(path, os.O_RDONLY, 0)
	if err != nil {
		return failedRead(client.ProjectReadFailureUnreadable)
	}
	defer file.Close()
	content, err := io.ReadAll(io.LimitReader(file, int64(limit)+1))
	if err != nil {
		return failedRead(client.ProjectReadFailureUnreadable)
	}
	truncated := len(content) > limit
	if truncated {
		content = cutAtRune(content[:limit])
	}
	if bytes.IndexByte(content[:min(len(content), binaryProbeBytes)], 0) >= 0 || !utf8.Valid(content) {
		return failedRead(client.ProjectReadFailureBinary)
	}
	digest := sha256.Sum256(content)
	text := string(content)
	size := info.Size()
	return client.ProjectReadReport{Text: &text, Digest: hex.EncodeToString(digest[:]), Size: &size, Truncated: truncated}
}

// cutAtRune drops the partial rune a cut left at the end, at most three bytes.
func cutAtRune(content []byte) []byte {
	for dropped := 0; dropped < utf8.UTFMax-1 && len(content) > 0 && !utf8.Valid(content); dropped++ {
		content = content[:len(content)-1]
	}
	return content
}

func leavesRoot(relative string) bool {
	return relative == ".." || strings.HasPrefix(relative, ".."+string(filepath.Separator))
}

func isHidden(relative string) bool {
	for _, part := range strings.Split(relative, string(filepath.Separator)) {
		if hiddenFolders[part] {
			return true
		}
	}
	return false
}

func failedRead(reason client.ProjectReadFailure) client.ProjectReadReport {
	return client.ProjectReadReport{Failure: reason}
}
