package shell

import (
	"reflect"
	"testing"
)

// Each line beside what Python's shlex.split gives for it, or nil where it raises.
var wordSamples = []struct {
	line  string
	items []string
}{
	{"git status --short", []string{"git", "status", "--short"}},
	{`grep -n "a b" 'c d' e\ f`, []string{"grep", "-n", "a b", "c d", "e f"}},
	{`echo "x\"y" "a\$b" "c\\d"`, []string{"echo", `x"y`, `a\$b`, `c\d`}},
	{`echo 'it'"'"'s'`, []string{"echo", "it's"}},
	{`printf "" ''`, []string{"printf", "", ""}},
	{"a\tb\nc  ", []string{"a", "b", "c"}},
	{"echo \\\nx", []string{"echo", "\nx"}},
	{"echo # not a comment", []string{"echo", "#", "not", "a", "comment"}},
	{`echo "open`, nil},
	{`echo end\`, nil},
	{"", nil},
}

func TestWordsAreReadAsShlexReadsThem(t *testing.T) {
	for _, sample := range wordSamples {
		items, err := Shlex(sample.line)
		if sample.items == nil && sample.line != "" {
			if err == nil {
				t.Errorf("words(%q) gave %q, shlex raises", sample.line, items)
			}
			continue
		}
		if err != nil || !reflect.DeepEqual(items, sample.items) {
			t.Errorf("words(%q) = %q, %v; want %q", sample.line, items, err, sample.items)
		}
	}
}

func TestTokensLeaveOutCommentLinesAndLeadingAssignments(t *testing.T) {
	cases := map[string][]string{
		"# note\n  # more\nFOO=1 BAR=x git log": {"git", "log"},
		"A=1 -x=2 cmd":                          {"-x=2", "cmd"},
		`echo "open`:                            {"echo", `"open`},
	}
	for line, want := range cases {
		if actual := Tokens(line); !reflect.DeepEqual(actual, want) {
			t.Errorf("tokens(%q) = %q, want %q", line, actual, want)
		}
	}
}

func TestJoinQuotesAsShlexDoes(t *testing.T) {
	if actual := Join([]string{"bash", "-lc", "ls -la", "", "it's", "a/b.c=1:@%+,"}); actual != `bash -lc 'ls -la' '' 'it'"'"'s' a/b.c=1:@%+,` {
		t.Errorf("join gave %s", actual)
	}
}
