package launch

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

func worktreeProject(root string) *fakeJournal {
	return &fakeJournal{suites: []string{"coding"}, environments: []Environment{{Name: "main", Folder: root, Branch: "main", Suite: "coding"}}}
}

func TestANamedWorktreeLaunchWorksInItsOwnFolderAndBranchWithAnEnvironmentOfItsOwn(t *testing.T) {
	root := gitRepository(t)
	journal := worktreeProject(root)
	choice, err := Boot(journal, keys(enterPress, enterPress), Request{Program: "claude", Root: root, Worktree: "cart", WorktreeGiven: true})
	if err != nil || choice.Environment != "cart" || choice.Folder != worktreeFolder(root, "cart") {
		t.Fatalf("the launch chose %+v, %v", choice, err)
	}
	if branch := run(t, choice.Folder, "git", "symbolic-ref", "--short", "HEAD"); branch != "worktree-cart" {
		t.Fatalf("the worktree is on %s, not worktree-cart", branch)
	}
	created := Environment{Name: "cart", Folder: worktreeFolder(root, "cart"), Branch: "worktree-cart", Suite: "coding"}
	if len(journal.created) != 1 || journal.created[0] != created {
		t.Fatalf("the journal was asked to make %+v, not %+v", journal.created, created)
	}
	if choice.Variables["JOURNAL_ENVIRONMENT"] != "cart" {
		t.Fatalf("the program's hooks would name %q, not the worktree's environment", choice.Variables["JOURNAL_ENVIRONMENT"])
	}
}

func TestABareWorktreeMakesUpATwoWordNameNoFolderBranchTipOrEnvironmentHolds(t *testing.T) {
	root := gitRepository(t)
	names := Worktrees{Root: root}.Names()
	takenNames := names[:len(names)-4]
	run(t, root, "git", "branch", "worktree-"+names[len(names)-4])
	run(t, root, "git", "update-ref", TipsRef+"/"+names[len(names)-3], "HEAD")
	if err := os.MkdirAll(worktreeFolder(root, names[len(names)-2]), 0o755); err != nil {
		t.Fatal(err)
	}
	name := Worktrees{Root: root}.UnusedName(takenNames)
	if name != names[len(names)-1] || !regexp.MustCompile(`^[a-z]+-[a-z]+$`).MatchString(name) {
		t.Fatalf("the made-up name %q is taken, or not two words", name)
	}
}

func TestAWorktreeLaunchNeverSharesAnEnvironmentALiveSessionHoldsAndTakesTheNextNumber(t *testing.T) {
	if name := UnheldName("cart", []string{"cart", "cart-2"}); name != "cart-3" {
		t.Fatalf("a launch while cart and cart-2 are live took %q, not cart-3", name)
	}
	if name := UnheldName("cart", []string{"till"}); name != "cart" {
		t.Fatalf("a launch while cart is free took %q", name)
	}
}

func TestMainIsNeverAWorktreeName(t *testing.T) {
	root := gitRepository(t)
	_, err := Boot(worktreeProject(root), keys(enterPress, enterPress), Request{Program: "claude", Root: root, Worktree: "main", WorktreeGiven: true})
	if err == nil || err.Error() != MainWorktreeRefusal {
		t.Fatalf("a worktree named main was not refused: %v", err)
	}
}

func TestAnEnvironmentThatRecordsAWorktreeWorksInItHoweverItIsLaunchedAndALostFolderIsMadeAgainFromTheKeptTip(t *testing.T) {
	root := gitRepository(t)
	journal := worktreeProject(root)
	if _, err := Boot(journal, keys(enterPress, enterPress), Request{Program: "claude", Root: root, Worktree: "cart", WorktreeGiven: true}); err != nil {
		t.Fatal(err)
	}
	folder := worktreeFolder(root, "cart")
	run(t, folder, "git", "-c", "user.name=Story", "-c", "user.email=story@example.com", "commit", "--allow-empty", "-m", "The cart total")
	tip := run(t, folder, "git", "rev-parse", "HEAD")
	if _, err := Boot(journal, keys(enterPress, enterPress, enterPress), Request{Program: "claude", Root: root}); err != nil {
		t.Fatal(err)
	}
	if err := os.RemoveAll(folder); err != nil {
		t.Fatal(err)
	}
	run(t, root, "git", "worktree", "prune")
	run(t, root, "git", "branch", "-D", "worktree-cart")
	choice, err := Boot(journal, keys(enterPress, enterPress, enterPress), Request{Program: "claude", Root: root})
	if err != nil || choice.Environment != "cart" || choice.Folder != folder {
		t.Fatalf("a plain launch of the cart environment chose %+v, %v", choice, err)
	}
	if head := run(t, folder, "git", "rev-parse", "HEAD"); head != tip {
		t.Fatalf("the lost worktree came back at %s, not at its kept tip %s", head, tip)
	}
}

func TestOnlyTheUserRemovesALaunchWorktreeAndItsBranchAndLastCommitStay(t *testing.T) {
	root := gitRepository(t)
	worktrees := Worktrees{Root: root}
	folder, err := worktrees.Prepare("cart")
	if err != nil {
		t.Fatal(err)
	}
	if err := worktrees.Remove("cart", true); err == nil || !strings.Contains(err.Error(), "a session works in it") {
		t.Fatalf("a worktree a session works in was removed: %v", err)
	}
	if err := os.WriteFile(filepath.Join(folder, "cart.py"), []byte("TOTAL = 1\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := worktrees.Remove("cart", false); err == nil || !strings.Contains(err.Error(), "cart.py") {
		t.Fatalf("a worktree with uncommitted work was removed: %v", err)
	}
	run(t, folder, "git", "add", "cart.py")
	run(t, folder, "git", "-c", "user.name=Story", "-c", "user.email=story@example.com", "commit", "-m", "The cart total")
	tip := run(t, folder, "git", "rev-parse", "HEAD")
	if err := worktrees.Remove("cart", false); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(folder); !os.IsNotExist(err) {
		t.Fatalf("the worktree folder is still there: %v", err)
	}
	if branch := run(t, root, "git", "rev-parse", "worktree-cart"); branch != tip {
		t.Fatalf("the branch worktree-cart is at %s, not its last commit %s", branch, tip)
	}
	if tipCommit := run(t, root, "git", "rev-parse", TipsRef+"/cart"); tipCommit != tip {
		t.Fatalf("the kept tip is %s, not the last commit %s", tipCommit, tip)
	}
}

func TestTheWorktreeListNamesWorktreesWhoseEnvironmentIsGone(t *testing.T) {
	root := gitRepository(t)
	worktrees := Worktrees{Root: root}
	for _, name := range []string{"cart", "till"} {
		if _, err := worktrees.Prepare(name); err != nil {
			t.Fatal(err)
		}
	}
	orphans := worktrees.Orphans([]string{"main", "cart"})
	if len(orphans) != 1 || orphans[0] != "till" {
		t.Fatalf("the worktrees without an environment are %v, not [till]", orphans)
	}
}

func TestALaunchFromInsideAWorktreeUsesTheMainCheckoutsJournal(t *testing.T) {
	root := gitRepository(t)
	folder, err := Worktrees{Root: root}.Prepare("cart")
	if err != nil {
		t.Fatal(err)
	}
	projectFolder, err := ProjectRoot(filepath.Join(folder))
	resolved, _ := filepath.EvalSymlinks(root)
	if err != nil || projectFolder != resolved {
		t.Fatalf("a launch inside the cart worktree found the project at %q, not %q: %v", projectFolder, resolved, err)
	}
}
