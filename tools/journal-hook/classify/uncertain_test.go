package classify

import "testing"

func TestAScriptThatCanWriteIsAnUncertainWrite(t *testing.T) {
	lines := []string{
		`awk 'BEGIN { system("rm a.txt") }' notes.txt`,
		`awk '{ print > "out.txt" }' notes.txt`,
		`awk '{ print | "sh" }' notes.txt`,
		`awk 'BEGIN { "date" | getline now }' notes.txt`,
		`sed -n 'w out.txt' notes.txt`,
		`sed -n '1,5w out.txt' notes.txt`,
		`sed -n '/a/w out.txt' notes.txt`,
		`sed -n 's/a/b/w out.txt' notes.txt`,
		`sed -n 's|a|b|gw out.txt' notes.txt`,
		`sed -n 's/a/b/e' notes.txt`,
		`sed -n '1e rm a.txt' notes.txt`,
	}
	if classification := shippedClassifier.Line("sysctl -w a=1").Parts[0].Classification; !hasEffect(classification.Effects, writesFiles) {
		t.Errorf("sysctl -w reads as %+v", classification)
	}
	for _, line := range lines {
		classification := shippedClassifier.Line(line).Parts[0].Classification
		if !classification.Uncertain || !hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}

func TestAPlainScriptStaysARead(t *testing.T) {
	lines := []string{
		`awk '{ print $1 }' notes.txt`,
		`awk '$2 > "2026" { print }' notes.txt`,
		`awk '/mkdir/ { print }' notes.txt`,
		`awk -F, 'NR > 1 { print $2 }' notes.txt`,
		`sed -n '1,5p' notes.txt`,
		`sed -n '/unlink/p' notes.txt`,
		`sed -e 's/a/b/' notes.txt`,
		`sed -n 's/a/b/gp' notes.txt`,
		`sed -n 's/one/two/p;$p' notes.txt`,
		`sed -n 1,140p src/features/team/support/team_join.py`,
		`ps aux`,
		`pgrep -f server`,
		`lsof -i :8080`,
		`sysctl -n hw.memsize`,
		`vm_stat`,
	}
	for _, line := range lines {
		classification := shippedClassifier.Line(line).Parts[0].Classification
		if classification.Uncertain || hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}

func TestAProgramTheLineCannotJudgeIsUncertain(t *testing.T) {
	if !shippedClassifier.Line("aws s3 ls").Parts[0].Classification.Uncertain {
		t.Error("an uncertain row reached the part as certain")
	}
	if shippedClassifier.Line("ls").Parts[0].Classification.Uncertain {
		t.Error("a plain read reached the part as uncertain")
	}
}

func TestFindWithDeleteIsNoRead(t *testing.T) {
	classification := shippedClassifier.Line("find . -name a -delete").Parts[0].Classification
	if !hasEffect(classification.Effects, "deletes_files") {
		t.Errorf("find -delete reads as %+v", classification)
	}
}

func hasEffect(effects []string, effect string) bool {
	for _, name := range effects {
		if name == effect {
			return true
		}
	}
	return false
}
