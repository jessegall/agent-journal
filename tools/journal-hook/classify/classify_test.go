package classify

import (
	"reflect"
	"testing"
)

// Each command beside the classification version 4's table and classifier give it.
var classifyCases = []struct {
	text      string
	kind      string
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
		got := shippedClassifier.Classify(sample.text)
		if got.Kind != sample.kind || !reflect.DeepEqual(got.Effects, sample.effects) || got.Uncertain != sample.uncertain {
			t.Errorf("%q: %+v, want %s %q uncertain %v", sample.text, got, sample.kind, sample.effects, sample.uncertain)
		}
	}
}

func TestALineIsNamedByItsWeightiestPartAndKnowsAJournalOnlyLine(t *testing.T) {
	cases := []struct {
		line    string
		kind    string
		journal bool
	}{
		{"git status && echo hi > out.txt", "version control", false},
		{"ls && pytest -q", "test run", false},
		{"journal task show 1 | head -5", "journal", true},
		{"journal task show 1 && ls", "journal", false},
		{`echo "open`, "unknown", false},
	}
	for _, sample := range cases {
		line := shippedClassifier.Line(sample.line)
		if line.Kind != sample.kind || line.IsJournalOnly != sample.journal {
			t.Errorf("%q: kind %s journal %v", sample.line, line.Kind, line.IsJournalOnly)
		}
	}
}
