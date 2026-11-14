package classify

import "testing"

func TestGitsReadingSubcommandsAreReads(t *testing.T) {
	for _, line := range []string{"git diff", "git diff HEAD~1 -- a.py", "git log --oneline -5", "git show HEAD:a.py", "git status --short", "git blame a.py", "git grep cart", "git -C /work diff"} {
		classification := shippedClassifier.Line(line).Parts[0].Classification
		if (classification.Category != "read" && classification.Category != "search") || classification.Uncertain || hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}

func TestGitsInspectingSubcommandsAreReads(t *testing.T) {
	for _, line := range []string{
		"git ls-tree v4.69.18", "git ls-tree -r HEAD --name-only", "git ls-files", "git ls-files --others", "git rev-parse HEAD", "git rev-parse --show-toplevel",
		"git cat-file -p HEAD:a.py", "git merge-base main HEAD", "git name-rev HEAD", "git describe --tags", "git shortlog -sn", "git for-each-ref refs/tags",
		"git show-ref --tags", "git blame a.py", "git reflog", "git reflog show HEAD", "git -C /work ls-tree HEAD",
	} {
		classification := shippedClassifier.Line(line).Parts[0].Classification
		if classification.Category != "read" || classification.Uncertain || hasEffect(classification.Effects, writesFiles) || hasEffect(classification.Effects, "changes_version_control") {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}

func TestGitsWritingPlumbingIsNoRead(t *testing.T) {
	for _, line := range []string{"git update-ref refs/heads/x HEAD", "git reflog expire --all", "git reflog delete HEAD@{1}", "git symbolic-ref HEAD refs/heads/x", "git update-index --add a.py"} {
		if classification := shippedClassifier.Line(line).Parts[0].Classification; classification.Category == "read" {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}

func TestGitOptionsThatWriteOrRunAreNoReads(t *testing.T) {
	writes := []string{"git diff --output=out.txt", "git diff --output out.txt", "git log --output=out.txt", "git show --output=out.txt", "git log -p > out.txt"}
	for _, line := range writes {
		if classification := shippedClassifier.Line(line).Parts[0].Classification; !hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
	runs := []string{"git -c core.pager=sh log", "git -c diff.external=rm diff", "git diff --ext-diff", "git log --ext-diff", "git show --ext-diff", "git grep -O cart", "git grep --open-files-in-pager=sh cart"}
	for _, line := range runs {
		if classification := shippedClassifier.Line(line).Parts[0].Classification; !classification.Uncertain {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}

func TestOtherGitSubcommandsStayVersionControl(t *testing.T) {
	for _, line := range []string{"git commit -m x", "git push", "git checkout main", "git stash", "git fetch"} {
		if classification := shippedClassifier.Line(line).Parts[0].Classification; classification.Category == "read" {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}
