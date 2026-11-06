package classify

import (
	"os"
	"path/filepath"
	"reflect"
	"slices"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// Each command beside the classification version 4's table and classifier give it.
var classifyCases = []struct {
	text      string
	category  string
	effects   []string
	uncertain bool
}{
	{"git status", "read", []string{"reads_files"}, false},
	{"nosuchprogram --flag x", "unknown", []string{}, false},
	{"git checkout main", "version control", []string{"changes_version_control", "writes_files"}, true},
	{"sed -i s/a/b/ notes.txt", "edit", []string{"writes_files"}, false},
	{"sed -n 1,5p notes.txt", "read", []string{"prints_files", "reads_files"}, false},
	{"cat a.txt > b.txt", "read", []string{"prints_files", "reads_files", "writes_files"}, false},
	{"bash -c 'rm -rf build'", "edit", []string{"deletes_files"}, false},
	{"for f in *.tmp; do rm $f; done", "edit", []string{"deletes_files"}, false},
	{"(cd src && make)", "build", []string{"changes_folder", "makes_files", "reads_files", "runs_long"}, false},
	{"journal sins --changes", "test run", []string{"reads_files", "runs_long"}, false},
	{"journal sins src/core", "test run", []string{"reads_files", "runs_long"}, false},
	{"journal suite run", "test run", []string{"reads_files", "runs_long"}, false},
	{"journal task list", "journal", []string{}, false},
	{`pytest tests/cart.py --ask-main "the rounding only shows in a real run"`, "test run", []string{"reads_files", "runs_long"}, false},
	{`.venv/bin/python -m pytest tests/cart.py --ask-main "the rounding only shows in a real run"`, "test run", []string{"reads_files", "runs_long"}, false},
}

func TestEachCommandIsClassifiedByItsRowSubcommandAndFlags(t *testing.T) {
	for _, sample := range classifyCases {
		actual := shippedClassifier.Classify(sample.text)
		if actual.Category != sample.category || !reflect.DeepEqual(actual.Effects, sample.effects) || actual.Uncertain != sample.uncertain {
			t.Errorf("%q: %+v, want %s %q uncertain %v", sample.text, actual, sample.category, sample.effects, sample.uncertain)
		}
	}
}

func TestALineIsNamedByItsWeightiestPartAndKnowsAJournalOnlyLine(t *testing.T) {
	cases := []struct {
		line     string
		category string
		journal  bool
	}{
		{"git fetch && echo hi > out.txt", "version control", false},
		{"ls && pytest -q", "test run", false},
		{"journal task show 1 | head -5", "journal", true},
		{"journal task show 1 && ls", "journal", false},
		{`echo "open`, "unknown", false},
	}
	for _, sample := range cases {
		line := shippedClassifier.Line(sample.line)
		if !hasPartOf(line, sample.category) || line.IsJournalOnly != sample.journal {
			t.Errorf("%q: no part of %s, or journal %v", sample.line, sample.category, line.IsJournalOnly)
		}
	}
}

// Version 4's KIND_ORDER in src/journal/support/classification.py, which the table's category_order must keep.
func TestTheCategoryOrderIsVersion4s(t *testing.T) {
	version4 := []string{"test run", "build", "package", "edit", "network", "version control", "check", "process", "journal", "unknown", "search", "read"}
	if !reflect.DeepEqual(CategoryOrder, version4) {
		t.Errorf("category_order is %q", CategoryOrder)
	}
}

// hasPartOf says a part of the line has the category; a line no shell can read has no parts and counts as unknown.
func hasPartOf(line event.ShellLine, category string) bool {
	if len(line.Parts) == 0 {
		return category == unknown
	}
	return slices.ContainsFunc(line.Parts, func(part event.Part) bool { return part.Classification.Category == category })
}

func TestAMixedLineKeepsTheCategoryOfEachOfItsParts(t *testing.T) {
	cases := map[string]string{
		"cat a.txt | grep x":                          "search",
		"cat a.txt | head -5":                         "read",
		"grep -rn x src | head":                       "search",
		"cd src && git push":                           "version control",
		"npm install && npm test":                     "test run",
		"echo start; make build; ./deploy.sh":         "build",
		"journal task show 1 && nosuchtool --run":     "journal",
		"ls && nosuchtool":                            "unknown",
		"curl -s https://example.com | jq . > a.json": "network",
	}
	for line, category := range cases {
		if !hasPartOf(shippedClassifier.Line(line), category) {
			t.Errorf("%q has no part of %s", line, category)
		}
	}
}

func TestAnAliasIsClassifiedByTheCommandUnderIt(t *testing.T) {
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, "runtime"), 0o755); err != nil {
		t.Fatal(err)
	}
	aliases := `{"tests": "pytest -q", "tasks": "journal task list", "build-it": "npm run build"}`
	if err := os.WriteFile(filepath.Join(root, "runtime", aliasFileName), []byte(aliases), 0o644); err != nil {
		t.Fatal(err)
	}
	classifier := ClassifierOf(filepath.Join(root, "command_table.json"))
	for text, want := range map[string]string{"journal tests tests/a.py": "test run", "journal tasks": "journal", "journal build-it": "build", "journal task list": "journal"} {
		if category := classifier.Classify(text).Category; category != want {
			t.Errorf("%s is %q, want %q", text, category, want)
		}
	}
}

func TestARunnerLineIsReadAsTheLineItRuns(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	wrapped := `JOURNAL_AGENT_SESSION=s-1 '/work/.journal/bin/journal-run' --process 7 --limit 15 --queue -- 'cat notes; journal message read 12'`
	line := classifier.Line(wrapped)
	if line.Line != "cat notes; journal message read 12" || len(line.Parts) != 2 || line.Parts[1].Program != "journal" {
		t.Fatalf("read as %q with %d parts", line.Line, len(line.Parts))
	}
}

func TestGoWithAFolderFlagIsStillATestRun(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	if category := classifier.Classify("go -C tools/journal-run test . -run Report").Category; category != "test run" {
		t.Fatalf("category %q", category)
	}
}
