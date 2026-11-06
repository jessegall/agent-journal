package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// readLimit keeps a shell line from reading Denied, except the folders of Readable under it.
type readLimit struct {
	Denied   string
	Readable []string
}

// workerReadLimit denies the main checkout, which holds the worktree, and keeps what a worker's programs run from:
// the worktree, the shared git store, the rules the judge reads, the journal's programs and linked libraries.
// The file in a worktree's git folder where the journal lists what it placed there, named in worktree_git.py.
const worktreeExcludeFile = "journal-exclude"

func workerReadLimit(worktree, journalHome string) (readLimit, error) {
	resolved, err := filepath.EvalSymlinks(worktree)
	if err != nil {
		return readLimit{}, err
	}
	main, err := filepath.EvalSymlinks(filepath.Dir(journalHome))
	if err != nil {
		return readLimit{}, err
	}
	readable := []string{resolved, filepath.Join(main, ".git"), filepath.Join(main, ".venv"), filepath.Join(main, "node_modules"), filepath.Join(main, ".commandments")}
	for _, name := range []string{"bin", "runtime", "plugins", "plugin-data"} {
		readable = append(readable, filepath.Join(main, filepath.Base(journalHome), name))
	}
	entries, err := os.ReadDir(resolved)
	if err != nil {
		return readLimit{}, err
	}
	for _, entry := range entries {
		if entry.Type()&os.ModeSymlink == 0 {
			continue
		}
		if target, err := filepath.EvalSymlinks(filepath.Join(resolved, entry.Name())); err == nil {
			readable = append(readable, target)
		}
	}
	return readLimit{Denied: main, Readable: append(readable, excludedSymlinkTargets(resolved)...)}, nil
}

// excludedSymlinkTargets are the folders that library links lower in the worktree point at: the journal lists every
// linked library in the worktree's own exclude file, as /src/viewer/node_modules.
func excludedSymlinkTargets(worktree string) []string {
	link, err := os.ReadFile(filepath.Join(worktree, ".git"))
	if err != nil {
		return nil
	}
	gitFolder := strings.TrimSpace(strings.TrimPrefix(string(link), "gitdir:"))
	if !filepath.IsAbs(gitFolder) {
		gitFolder = filepath.Join(worktree, gitFolder)
	}
	excluded, err := os.ReadFile(filepath.Join(gitFolder, worktreeExcludeFile))
	if err != nil {
		return nil
	}
	var targets []string
	for _, line := range strings.Split(string(excluded), "\n") {
		path := filepath.Join(worktree, strings.TrimPrefix(strings.TrimSpace(line), "/"))
		info, err := os.Lstat(path)
		if err != nil || info.Mode()&os.ModeSymlink == 0 {
			continue
		}
		if target, err := filepath.EvalSymlinks(path); err == nil {
			targets = append(targets, target)
		}
	}
	return targets
}

func workerFolders(worktree, journalHome string) ([]string, error) {
	worktree, err := filepath.EvalSymlinks(worktree)
	if err != nil {
		return nil, err
	}
	main, err := filepath.EvalSymlinks(filepath.Dir(journalHome))
	if err != nil {
		return nil, err
	}
	if containsFolder(worktree, main) {
		return nil, fmt.Errorf("worker sandbox folder must not contain the main checkout")
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}
	cache, err := os.UserCacheDir()
	if err != nil {
		return nil, err
	}
	goPath := filepath.Join(home, "go")
	if configured := filepath.SplitList(os.Getenv("GOPATH")); len(configured) > 0 {
		goPath = configured[0]
	}
	caches := []string{
		configuredCache("GOCACHE", filepath.Join(cache, "go-build")),
		configuredCache("GOMODCACHE", filepath.Join(goPath, "pkg", "mod")),
		filepath.Join(goPath, "pkg", "sumdb"),
		configuredCache("npm_config_cache", configuredCache("NPM_CONFIG_CACHE", filepath.Join(home, ".npm"))),
		configuredCache("PIP_CACHE_DIR", filepath.Join(cache, "pip")),
		filepath.Join(home, ".cache", "agent-journal"),
		"/tmp",
	}
	writable := []string{worktree}
	for _, path := range caches {
		if path == "off" {
			continue
		}
		resolved, err := resolvedFolder(path)
		if err != nil {
			return nil, err
		}
		if containsFolder(resolved, main) || (containsFolder(main, resolved) && !containsFolder(worktree, resolved)) {
			return nil, fmt.Errorf("worker cache %s must not grant writes in the main checkout", path)
		}
		if err := os.MkdirAll(resolved, 0o700); err != nil {
			return nil, err
		}
		writable = append(writable, resolved)
	}
	return writable, nil
}

func configuredCache(variable, fallback string) string {
	if value := os.Getenv(variable); value != "" {
		return value
	}
	return fallback
}

func containsFolder(parent, child string) bool {
	relative, err := filepath.Rel(parent, child)
	return err == nil && relative != ".." && !strings.HasPrefix(relative, ".."+string(filepath.Separator))
}

func resolvedFolder(path string) (string, error) {
	absolute, err := filepath.Abs(path)
	if err != nil {
		return "", err
	}
	var missing []string
	for {
		resolved, err := filepath.EvalSymlinks(absolute)
		if err == nil {
			for index := len(missing) - 1; index >= 0; index-- {
				resolved = filepath.Join(resolved, missing[index])
			}
			return resolved, nil
		}
		if !os.IsNotExist(err) {
			return "", err
		}
		missing = append(missing, filepath.Base(absolute))
		absolute = filepath.Dir(absolute)
	}
}
