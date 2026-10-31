package classify

import (
	"reflect"
	"testing"
)

// Each command beside the classification version 4's table and classifier give it.
var classifyCases = []struct {
	text      string
	category  string
	effects   []string
	uncertain bool
}{
	{"git status", "version control", []string{"reads_files"}, false},
	{"nosuchprogram --flag x", "unknown", []string{}, false},
	{"git checkout main", "version control", []string{"changes_version_control", "writes_files"}, true},
	{"sed -i s/a/b/ notes.txt", "edit", []string{"writes_files"}, false},
	{"sed -n 1,5p notes.txt", "read", []string{"prints_files", "reads_files"}, false},
	{"cat a.txt > b.txt", "read", []string{"prints_files", "reads_files", "writes_files"}, false},
	{"bash -c 'rm -rf build'", "edit", []string{"deletes_files"}, false},
	{"for f in *.tmp; do rm $f; done", "edit", []string{"deletes_files"}, false},
	{"(cd src && make)", "build", []string{"changes_folder", "makes_files", "reads_files", "runs_long"}, false},
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
		{"git status && echo hi > out.txt", "version control", false},
		{"ls && pytest -q", "test run", false},
		{"journal task show 1 | head -5", "journal", true},
		{"journal task show 1 && ls", "journal", false},
		{`echo "open`, "unknown", false},
	}
	for _, sample := range cases {
		line := shippedClassifier.Line(sample.line)
		if line.Category != sample.category || line.IsJournalOnly != sample.journal {
			t.Errorf("%q: category %s journal %v", sample.line, line.Category, line.IsJournalOnly)
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

func TestMixedLinesAreNamedByTheirWeightiestPart(t *testing.T) {
	cases := map[string]string{
		"cat a.txt | grep x":                          "search",
		"cat a.txt | head -5":                         "read",
		"grep -rn x src | head":                       "search",
		"cd src && git log":                           "version control",
		"npm install && npm test":                     "test run",
		"echo start; make build; ./deploy.sh":         "build",
		"journal task show 1 && nosuchtool --run":     "journal",
		"ls && nosuchtool":                            "unknown",
		"curl -s https://example.com | jq . > a.json": "network",
	}
	for line, category := range cases {
		if actual := shippedClassifier.Line(line).Category; actual != category {
			t.Errorf("%q is %s, want %s", line, actual, category)
		}
	}
}
