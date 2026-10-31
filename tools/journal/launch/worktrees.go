package launch

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// TipsRef is where the last commit of each launch worktree is kept, so a lost folder comes back with its work.
const TipsRef = "refs/journal/worktrees"

// BranchPrefix starts the branch of each launch worktree, worktree-<name>.
const BranchPrefix = "worktree-"

// GitLimit is how long one git call of a launch may take.
var GitLimit = 60 * time.Second

// namePartsFirst and namePartsSecond are the words a made-up worktree name is put together from, one of each.
var (
	namePartsFirst  = []string{"amber", "brisk", "calm", "deft", "eager", "fond", "gentle", "hardy", "keen", "lucid", "mellow", "nimble", "rapid", "steady", "vivid", "warm"}
	namePartsSecond = []string{"otter", "heron", "maple", "cedar", "falcon", "harbor", "lantern", "meadow", "orchid", "pebble", "quartz", "river", "sparrow", "thistle", "willow", "zephyr"}
)

// Worktrees are the launch worktrees of a project, in .claude/worktrees/<name> on branch worktree-<name>.
type Worktrees struct {
	Root string
}

// Folder is the folder that holds every launch worktree of the project.
func (worktrees Worktrees) Folder() string {
	return filepath.Join(worktrees.Root, ".claude", "worktrees")
}

// Names are every two-word name a launch worktree can be given.
func (worktrees Worktrees) Names() []string {
	names := []string{}
	for _, first := range namePartsFirst {
		for _, second := range namePartsSecond {
			names = append(names, first+"-"+second)
		}
	}
	return names
}

// UnusedName is a two-word name no worktree folder, worktree branch, kept tip or environment holds yet.
func (worktrees Worktrees) UnusedName(environments []string) string {
	used := map[string]bool{}
	for _, name := range append(append(worktrees.folderNames(), worktrees.refNames()...), environments...) {
		used[name] = true
	}
	names := worktrees.Names()
	rand.Shuffle(len(names), func(first, second int) { names[first], names[second] = names[second], names[first] })
	for _, name := range names {
		if !used[name] {
			return name
		}
	}
	for number := 1; ; number++ {
		if name := fmt.Sprintf("spare-%d", number); !used[name] {
			return name
		}
	}
}

// UnheldName is the name, or name-2, name-3 and so on, so a launch never shares an environment a working session holds.
func UnheldName(name string, working []string) string {
	candidate := name
	for number := 2; indexOf(working, candidate) >= 0; number++ {
		candidate = fmt.Sprintf("%s-%d", name, number)
	}
	return candidate
}

// Prepare gives the worktree's folder, cutting it when missing: on its branch when that is there, else from its kept
// tip, else from the project's HEAD; its last commit is kept as its tip.
func (worktrees Worktrees) Prepare(name string) (string, error) {
	folder := filepath.Join(worktrees.Folder(), name)
	if _, err := worktrees.git("rev-parse", "--verify", "--quiet", "HEAD"); err != nil {
		return "", fmt.Errorf("the project at %s has no commit to cut the worktree %s from: make a first commit, or launch without --worktree", worktrees.Root, name)
	}
	if _, err := os.Stat(folder); os.IsNotExist(err) {
		if err := worktrees.added(name, folder); err != nil {
			return "", err
		}
	}
	return folder, worktrees.keepTip(name, folder)
}

func (worktrees Worktrees) added(name, folder string) error {
	_, _ = worktrees.git("worktree", "prune")
	branch := BranchPrefix + name
	arguments := []string{"worktree", "add", "-b", branch, folder}
	if worktrees.has("refs/heads/" + branch) {
		arguments = []string{"worktree", "add", folder, branch}
	} else if worktrees.has(TipsRef + "/" + name) {
		arguments = append(arguments, TipsRef+"/"+name)
	}
	if output, err := worktrees.git(arguments...); err != nil {
		return fmt.Errorf("the worktree %s could not be cut: %s", name, output)
	}
	return nil
}

func (worktrees Worktrees) keepTip(name, folder string) error {
	tip, err := gitIn(folder, "rev-parse", "HEAD")
	if err != nil {
		return nil
	}
	ref := TipsRef + "/" + name
	if worktrees.has(ref) {
		if _, err := worktrees.git("merge-base", "--is-ancestor", ref, tip); err != nil {
			return nil
		}
	}
	_, err = worktrees.git("update-ref", ref, tip)
	return err
}

// Discard removes a launch worktree's folder at the user's word, keeping its branch and its last commit; it is refused
// while a session works in it or while it holds work that is not committed.
func (worktrees Worktrees) Discard(name string, working bool) error {
	folder := filepath.Join(worktrees.Folder(), name)
	if working {
		return fmt.Errorf("the worktree %s is not removed: a session works in it; end that session first", name)
	}
	status, err := gitIn(folder, "status", "--porcelain")
	if err != nil {
		return fmt.Errorf("the worktree %s is not there: %s", name, status)
	}
	if uncommitted := strings.TrimSpace(status); uncommitted != "" {
		files := []string{}
		for _, line := range strings.Split(uncommitted, "\n") {
			files = append(files, strings.TrimSpace(line[2:]))
		}
		return fmt.Errorf("the worktree %s is not removed: it holds uncommitted work in %s; commit or remove it first", name, strings.Join(files, ", "))
	}
	if err := worktrees.keepTip(name, folder); err != nil {
		return err
	}
	if output, err := worktrees.git("worktree", "remove", folder); err != nil {
		return fmt.Errorf("the worktree %s could not be removed: %s", name, output)
	}
	return nil
}

// Orphans are the launch worktrees whose environment is gone.
func (worktrees Worktrees) Orphans(environments []string) []string {
	orphans := []string{}
	for _, name := range worktrees.folderNames() {
		if indexOf(environments, name) < 0 {
			orphans = append(orphans, name)
		}
	}
	return orphans
}

// ProjectRoot is the main checkout of the project a folder belongs to, also from inside one of its worktrees.
func ProjectRoot(folder string) (string, error) {
	common, err := gitIn(folder, "rev-parse", "--path-format=absolute", "--git-common-dir")
	if err != nil {
		return "", fmt.Errorf("%s is in no git project: %s", folder, common)
	}
	return filepath.EvalSymlinks(filepath.Dir(common))
}

func (worktrees Worktrees) folderNames() []string {
	entries, err := os.ReadDir(worktrees.Folder())
	if err != nil {
		return nil
	}
	names := []string{}
	for _, entry := range entries {
		if entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") {
			names = append(names, entry.Name())
		}
	}
	return names
}

func (worktrees Worktrees) refNames() []string {
	output, err := worktrees.git("for-each-ref", "--format=%(refname)", "refs/heads/"+BranchPrefix+"*", TipsRef+"/")
	if err != nil {
		return nil
	}
	names := []string{}
	for _, ref := range strings.Fields(output) {
		names = append(names, strings.TrimPrefix(strings.TrimPrefix(ref, "refs/heads/"+BranchPrefix), TipsRef+"/"))
	}
	return names
}

func (worktrees Worktrees) has(ref string) bool {
	_, err := worktrees.git("rev-parse", "--verify", "--quiet", ref)
	return err == nil
}

func (worktrees Worktrees) git(arguments ...string) (string, error) {
	return gitIn(worktrees.Root, arguments...)
}

// gitIn runs git in a folder under the launch's time limit and gives back what it printed.
func gitIn(folder string, arguments ...string) (string, error) {
	limit, cancel := context.WithTimeout(context.Background(), GitLimit)
	defer cancel()
	output, err := exec.CommandContext(limit, "git", append([]string{"-C", folder}, arguments...)...).CombinedOutput()
	if errors.Is(limit.Err(), context.DeadlineExceeded) {
		return string(output), fmt.Errorf("git %s took longer than %s", arguments[0], GitLimit)
	}
	return strings.TrimSpace(string(output)), err
}
