package classify

import "testing"

func TestAliasExpansionRewritesCommandsBeforeClassification(t *testing.T) {
	for _, sample := range []struct{ line, expanded string }{
		{"journal judged --changes", "echo checker --changes"},
		{"journal judged 'two words' '; touch escaped'", "echo checker 'two words' '; touch escaped'"},
		{"printf ready && journal judged src | cat", "printf ready && echo checker src | cat"},
		{"journal checked src", "echo checker src"},
		{`echo 'journal judged src'`, `echo 'journal judged src'`},
		{`echo "$(journal judged src)"`, `echo "$(echo checker src)"`},
		{"journal appended src", "echo checker src"},
		{"command journal judged src", "command echo checker src"},
		{"env CHECK=1 journal judged src", "env CHECK=1 echo checker src"},
		{"'journal' judged src", "echo checker src"},
		{"sh -c 'journal judged src'", "sh -c 'echo checker src'"},
		{"bash -lc 'journal judged src'", "bash -lc 'echo checker src'"},
		{"eval 'journal judged src'", "eval 'echo checker src'"},
	} {
		classifier := NewClassifier(LoadTable(""))
		classifier.aliasLines = map[string]string{"judged": "echo checker {args}", "checked": "journal judged {args}", "appended": "echo checker"}
		prepared := classifier.Line(sample.line)
		if prepared.ParseError != "" || prepared.Line != sample.expanded {
			t.Errorf("%q became %q, error %q; want %q", sample.line, prepared.Line, prepared.ParseError, sample.expanded)
		}
	}
}

func TestAliasExpansionKeepsCompoundCommandsAndReportsCycles(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	classifier.aliasLines = map[string]string{"pair": "echo one; echo two", "loop": "journal loop", "script-loop": "sh -c 'journal script-loop'"}
	line := classifier.Line("false && journal pair | cat")
	if line.ParseError != "" || line.Line != "false && ( echo one; echo two ) | cat" {
		t.Fatalf("compound alias %+v", line)
	}
	cycle := classifier.Line("journal loop")
	if cycle.ParseError == "" || len(cycle.Aliases) != 1 || cycle.Aliases[0] != "loop" {
		t.Fatalf("cyclic alias %+v", cycle)
	}
	scriptCycle := classifier.Line("journal script-loop")
	if scriptCycle.ParseError == "" || len(scriptCycle.Aliases) != 1 || scriptCycle.Aliases[0] != "script-loop" {
		t.Fatalf("cyclic shell alias %+v", scriptCycle)
	}
}

func TestAnUnknownCommandFromAnAliasTakesTheAliasCategory(t *testing.T) {
	for _, sample := range []struct{ line, category string }{
		{"journal sins --changes", "check"},
		{"journal listed src", "search"},
		{".journal/plugins/judge/bin/judge --changes", "unknown"},
	} {
		classifier := NewClassifier(LoadTable(""))
		classifier.aliasLines = map[string]string{"sins": ".journal/plugins/judge/bin/judge {args}", "listed": "ls {args}"}
		classifier.aliasCategories = map[string]string{"sins": "check", "listed": "test run"}
		prepared := classifier.Line(sample.line)
		if len(prepared.Parts) != 1 || prepared.Parts[0].Classification.Category != sample.category {
			t.Errorf("%q was classified %+v, want %q", sample.line, prepared.Parts, sample.category)
		}
	}
}
