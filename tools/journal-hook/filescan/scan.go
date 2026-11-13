// Package filescan finds the files that changed in a project since the last scan, from a fingerprint of each file, so
// a change any shell command makes counts as a file edit. It runs detached after a shell line, so nothing waits for it.
// It depends on git in no way: the text before a change is the text it kept, and git only fills in the text of a file
// the scan never saw, asked of the repository that holds that file.
package filescan

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/edits"
	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// The limits of one scan: a line that changes more files than this, such as a merge or a checkout, is no edit, and a
// file above the byte limit is not read.
const (
	ChangedFilesMost = 32
	fileBytesMost    = 1 << 20
	gitTimeLimit     = 5 * time.Second
	lockSeconds      = 120
)

const (
	fingerprintsFile = "fingerprints.json"
	lockFile         = "lock"
	reportFile       = "report.json"
	againFile        = "again"
	textFolder       = "text"
	textsKeptFile    = "texts-kept"
	ignoreFile       = ".gitignore"
	worktreesFolder  = "worktrees"
	rootFolder       = "."
)

// skippedFolders hold what no agent writes by hand, in any project.
var skippedFolders = map[string]bool{".git": true, ".journal": true, ".venv": true, "venv": true, "node_modules": true, "__pycache__": true,
	"dist": true, "vendor": true, ".idea": true, ".cache": true, ".pytest_cache": true, ".mypy_cache": true, "graphify-out": true}

// Fingerprint tells whether a file may have changed without reading it.
type Fingerprint struct {
	Size       int64 `json:"size"`
	ModifiedNs int64 `json:"modified_ns"`
}

// Change is one file a scan found changed, with its counted lines and its rows.
type Change struct {
	Diff event.DiffCount `json:"diff"`
	Rows []event.DiffRow `json:"rows"`
}

// Report is what a scan hands the server: the folder it read and each changed file, its path from that folder.
type Report struct {
	Folder  string   `json:"folder"`
	Changes []Change `json:"changes"`
}

// ReportPath is where a scan leaves what it found for the journal to read.
func ReportPath(state string) string {
	return filepath.Join(state, reportFile)
}

// ScanRoot is the folder a scan reads for the journal at home: the worktree a worker works in, which lies two folders
// below the journal's worktrees folder, else the project folder that holds the journal. It does not move with the
// working folder, so an edit in any repository the project holds is read from the same root.
func ScanRoot(home, folder string) string {
	worktrees := filepath.Join(home, worktreesFolder)
	if relative, err := filepath.Rel(resolvedFolder(worktrees), resolvedFolder(folder)); err == nil {
		parts := strings.Split(filepath.ToSlash(relative), "/")
		if len(parts) >= 2 && parts[0] != ".." && parts[0] != rootFolder {
			return filepath.Join(worktrees, parts[0], parts[1])
		}
	}
	return filepath.Dir(home)
}

func resolvedFolder(folder string) string {
	absolute, err := filepath.Abs(folder)
	if err != nil {
		return folder
	}
	if resolved, err := filepath.EvalSymlinks(absolute); err == nil {
		return resolved
	}
	return absolute
}

// StateFolder is where the journal at home keeps what it knows of the folder at root.
func StateFolder(home, root string) string {
	sum := sha256.Sum256([]byte(root))
	return filepath.Join(home, "runtime", "file-scan", hex.EncodeToString(sum[:8]))
}

// Acquire takes the scan of a root, or leaves word for the scan that runs to go round again; a lock left by a scan that
// died passes after its time limit.
func Acquire(state string) bool {
	if err := os.MkdirAll(state, 0o700); err != nil {
		return false
	}
	lock := filepath.Join(state, lockFile)
	if lockFacts, err := os.Stat(lock); err == nil && time.Since(lockFacts.ModTime()) > lockSeconds*time.Second {
		_ = os.Remove(lock)
	}
	file, err := os.OpenFile(lock, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o600)
	if err != nil {
		_ = os.WriteFile(filepath.Join(state, againFile), nil, 0o600)
		return false
	}
	file.Close()
	return true
}

// Release gives the scan up.
func Release(state string) {
	_ = os.Remove(filepath.Join(state, lockFile))
}

// MustRepeat says whether a line ended during the scan, and clears the word.
func MustRepeat(state string) bool {
	return os.Remove(filepath.Join(state, againFile)) == nil
}

func fingerprintOf(facts fs.FileInfo) Fingerprint {
	return Fingerprint{Size: facts.Size(), ModifiedNs: facts.ModTime().UnixNano()}
}

// Scan compares the project at root with its last scan and returns each file that changed. The first scan of a root has
// no last scan: it counts each file modified at or after since as changed by the line or tool that started it, and
// takes every other file as it is. Once per root it keeps the text of every file, so a later edit of any file counts
// against the text it had.
func Scan(root, state string, cutoff time.Time) ([]Change, error) {
	if err := os.MkdirAll(filepath.Join(state, textFolder), 0o700); err != nil {
		return nil, err
	}
	previous, hasScan := readFingerprints(state)
	current, err := fingerprints(root)
	if err != nil {
		return nil, err
	}
	if !hasScan {
		previous = unchangedSince(current, cutoff)
	}
	if err := writeFingerprints(state, current); err != nil {
		return nil, err
	}
	paths := differing(previous, current)
	if !textsKept(state) {
		keepUnchangedTexts(root, state, current, paths)
	}
	if len(paths) > ChangedFilesMost {
		for _, path := range paths {
			keepText(state, path, readText(root, path))
		}
		return nil, nil
	}
	changes := []Change{}
	for _, path := range paths {
		_, scanned := previous[path]
		_, exists := current[path]
		var original *string
		if scanned || !hasScan {
			original = oldText(root, state, path)
		}
		if change, changed := fileChange(root, state, path, original, scanned || original != nil, exists); changed {
			changes = append(changes, change)
		}
	}
	return changes, nil
}

// unchangedSince is the fingerprint of each file last modified before since: what a first scan takes as it was. With no
// moment named every file is taken as it was.
func unchangedSince(current map[string]Fingerprint, cutoff time.Time) map[string]Fingerprint {
	if cutoff.IsZero() {
		return current
	}
	unchanged := map[string]Fingerprint{}
	for path, fingerprint := range current {
		if fingerprint.ModifiedNs < cutoff.UnixNano() {
			unchanged[path] = fingerprint
		}
	}
	return unchanged
}

func textsKept(state string) bool {
	_, err := os.Stat(filepath.Join(state, textsKeptFile))
	return err == nil
}

// keepUnchangedTexts keeps the text of each file this scan found unchanged, once per root, so no later edit lacks the
// text before it; a changed file keeps its text when its change is read.
func keepUnchangedTexts(root, state string, current map[string]Fingerprint, changed []string) {
	changedPaths := map[string]bool{}
	for _, path := range changed {
		changedPaths[path] = true
	}
	for path := range current {
		if changedPaths[path] {
			continue
		}
		if text := readText(root, path); text != nil {
			keepText(state, path, text)
		}
	}
	_ = os.WriteFile(filepath.Join(state, textsKeptFile), nil, 0o600)
}

func differing(previous, current map[string]Fingerprint) []string {
	paths := []string{}
	for path, currentFingerprint := range current {
		if previousFingerprint, exists := previous[path]; !exists || previousFingerprint != currentFingerprint {
			paths = append(paths, path)
		}
	}
	for path := range previous {
		if _, exists := current[path]; !exists {
			paths = append(paths, path)
		}
	}
	sort.Strings(paths)
	return paths
}

func fileChange(root, state, path string, original *string, existed, exists bool) (Change, bool) {
	changed := ""
	if exists {
		text := readText(root, path)
		if text == nil {
			return Change{}, false
		}
		changed = *text
		keepText(state, path, text)
	} else {
		keepText(state, path, nil)
	}
	if original != nil && *original == changed && exists {
		return Change{}, false
	}
	diff := edits.Counted(path, original, changed)
	diff.Existed = existed
	return Change{Diff: *diff, Rows: edits.ChangedRows(original, changed)}, true
}

// oldText is the text this journal last saw of a file, else what the last commit of the repository that holds the file
// has of it, asked from the file's own folder; with no such repository or commit there is none.
func oldText(root, state, path string) *string {
	if text, err := os.ReadFile(textPath(state, path)); err == nil {
		content := string(text)
		return &content
	}
	absolutePath := filepath.Join(root, path)
	limited, cancel := context.WithTimeout(context.Background(), gitTimeLimit)
	defer cancel()
	command := exec.CommandContext(limited, "git", "-C", filepath.Dir(absolutePath), "show", "HEAD:./"+filepath.Base(absolutePath))
	output, err := command.Output()
	if err != nil {
		return nil
	}
	content := string(output)
	return &content
}

func textPath(state, path string) string {
	sum := sha256.Sum256([]byte(path))
	return filepath.Join(state, textFolder, hex.EncodeToString(sum[:16]))
}

// keepText keeps the text a file has now for its next comparison; a file gone, too large or binary keeps none.
func keepText(state, path string, text *string) {
	if text == nil {
		_ = os.Remove(textPath(state, path))
		return
	}
	_ = os.WriteFile(textPath(state, path), []byte(*text), 0o600)
}

// readText is a file's text, or nil for one that is gone, too large or binary.
func readText(root, path string) *string {
	facts, err := os.Stat(filepath.Join(root, path))
	if err != nil || facts.Size() > fileBytesMost {
		return nil
	}
	content, err := os.ReadFile(filepath.Join(root, path))
	if err != nil || bytes.IndexByte(content, 0) >= 0 {
		return nil
	}
	text := string(content)
	return &text
}

// fingerprints walks the project and fingerprints each file no rule leaves out: the skipped folders, and the ignore
// file of each folder for what lies below it, so an inner repository's own rules hold for its files.
func fingerprints(root string) (map[string]Fingerprint, error) {
	rules := ignoreRules{}
	rules.read(root, rootFolder)
	prints := map[string]Fingerprint{}
	err := filepath.WalkDir(root, func(path string, entry fs.DirEntry, walkError error) error {
		if walkError != nil {
			if errors.Is(walkError, fs.ErrNotExist) {
				return nil
			}
			return walkError
		}
		if path == root {
			return nil
		}
		relative, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		if entry.IsDir() {
			if skippedFolders[entry.Name()] || rules.matches(relative, entry.Name()) {
				return filepath.SkipDir
			}
			rules.read(root, relative)
			return nil
		}
		if !entry.Type().IsRegular() || rules.matches(relative, entry.Name()) {
			return nil
		}
		facts, err := entry.Info()
		if err != nil {
			if errors.Is(err, fs.ErrNotExist) {
				return nil
			}
			return err
		}
		prints[relative] = fingerprintOf(facts)
		return nil
	})
	return prints, err
}

func readFingerprints(state string) (map[string]Fingerprint, bool) {
	content, err := os.ReadFile(filepath.Join(state, fingerprintsFile))
	if err != nil {
		return nil, false
	}
	prints := map[string]Fingerprint{}
	if json.Unmarshal(content, &prints) != nil {
		return nil, false
	}
	return prints, true
}

func writeFingerprints(state string, prints map[string]Fingerprint) error {
	content, err := json.Marshal(prints)
	if err != nil {
		return err
	}
	temporary := filepath.Join(state, fingerprintsFile+"."+strconv.Itoa(os.Getpid()))
	if err := os.WriteFile(temporary, content, 0o600); err != nil {
		return err
	}
	return os.Rename(temporary, filepath.Join(state, fingerprintsFile))
}

// ignoreRules are the patterns of each folder's ignore file, by the folder's path from the root.
type ignoreRules map[string]ignoredPatterns

// read takes the ignore file of one folder, when it has one.
func (rules ignoreRules) read(root, folder string) {
	content, err := os.ReadFile(filepath.Join(root, folder, ignoreFile))
	if err != nil {
		return
	}
	rules[folder] = parsedPatterns(string(content))
}

// matches says whether the ignore file of any folder above a path leaves it out, each pattern read from its own folder.
func (rules ignoreRules) matches(relative, name string) bool {
	folder := filepath.Dir(relative)
	for {
		if patterns, matched := rules[folder]; matched {
			relativePath, err := filepath.Rel(folder, relative)
			if err == nil && patterns.matches(relativePath, name) {
				return true
			}
		}
		if folder == rootFolder {
			return false
		}
		folder = filepath.Dir(folder)
	}
}

// ignoredPatterns are the simple patterns of one ignore file: a name, a *.ext or a path from its folder.
type ignoredPatterns struct {
	names []string
	paths []string
}

func parsedPatterns(content string) ignoredPatterns {
	patterns := ignoredPatterns{}
	for _, line := range strings.Split(content, "\n") {
		pattern := strings.TrimSuffix(strings.TrimSpace(line), "/")
		if pattern == "" || strings.HasPrefix(pattern, "#") || strings.HasPrefix(pattern, "!") {
			continue
		}
		if strings.Contains(pattern, "/") {
			patterns.paths = append(patterns.paths, strings.TrimPrefix(pattern, "/"))
		} else {
			patterns.names = append(patterns.names, pattern)
		}
	}
	return patterns
}

func (patterns ignoredPatterns) matches(relative, name string) bool {
	for _, pattern := range patterns.names {
		if matched, _ := filepath.Match(pattern, name); matched {
			return true
		}
	}
	slashed := filepath.ToSlash(relative)
	for _, pattern := range patterns.paths {
		if matched, _ := filepath.Match(pattern, slashed); matched {
			return true
		}
	}
	return false
}
