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
