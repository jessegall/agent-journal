package shell

import (
	"fmt"
	"reflect"
	"strings"
	"testing"
)

// Each line beside its commands written text, then the joiner or pipe after it: a > n is piped into command n.
var splitCases = []struct {
	line      string
	commands  []string
	redirects []string
}{
	{"git status", []string{"git status"}, nil},
	{"git status && grep -n foo src/app.py | head -5", []string{"git status &&", "grep -n foo src/app.py >2", "head -5"}, nil},
	{"make || echo failed", []string{"make ||", "echo failed"}, nil},
	{"cd src; ls -la", []string{"cd src ;", "ls -la"}, nil},
	{"cd src\nls -la\n", []string{"cd src ;", "ls -la"}, nil},
	{"sleep 5 & echo started", []string{"sleep 5 & &", "echo started"}, nil},
	{"a | b |& c", []string{"a >1", "b >2", "c"}, nil},
	{`echo "a && b; c" 'd | e' f\;g`, []string{`echo "a && b; c" 'd | e' f\;g`}, nil},
	{"ls > out.txt 2>&1 && cat < in.txt", []string{"ls > out.txt 2>&1 &&", "cat < in.txt"}, []string{"> out.txt", "2>&1", "< in.txt"}},
	{"cat <<EOF | grep x\nline && more\nEOF\necho done", []string{"cat <<EOF\nline && more\nEOF >1", "grep x ;", "echo done"}, []string{"<<EOF"}},
	{"a || (b && c) ; d", []string{"a ||", "(b && c) ;", "d"}, nil},
	{"{ a; b; } > log && c", []string{"{ a; b; } > log &&", "c"}, []string{"> log"}},
	{"for f in *.go; do gofmt -l $f; done && echo ok", []string{"for f in *.go; do gofmt -l $f; done &&", "echo ok"}, nil},
	{"if [ -f a ]; then rm a; fi", []string{"if [ -f a ]; then rm a; fi"}, nil},
	{"FOO=1 BAR=2 make test", []string{"FOO=1 BAR=2 make test"}, nil},
	{"! grep -q x file", []string{"! grep -q x file"}, nil},
	{"echo $(git rev-parse HEAD) `date`", []string{"echo $(git rev-parse HEAD) `date`"}, nil},
	{"repeat 3 echo hi", []string{"repeat 3 echo hi"}, nil},
	{"", nil, nil},
}

func TestSplitGivesEachCommandWithItsJoinerAndPipe(t *testing.T) {
	for _, sample := range splitCases {
		commands, redirects, err := Split(sample.line)
		if err != nil {
			t.Errorf("split(%q): %v", sample.line, err)
			continue
		}
		var got []string
		for _, command := range commands {
			text := command.Text
			if command.JoinedBy != "" {
				text += " " + command.JoinedBy
			}
			if command.PipedInto >= 0 {
				text += fmt.Sprintf(" >%d", command.PipedInto)
			}
			got = append(got, text)
			if !strings.HasPrefix(command.Text, strings.TrimSpace(sample.line[command.Start:command.End])) {
				t.Errorf("split(%q): %q does not stand at %d-%d", sample.line, command.Text, command.Start, command.End)
			}
		}
		if !reflect.DeepEqual(got, sample.commands) {
			t.Errorf("split(%q)\n got  %q\n want %q", sample.line, got, sample.commands)
		}
		if sample.redirects != nil && !reflect.DeepEqual(redirects, sample.redirects) {
			t.Errorf("split(%q) redirects %q, want %q", sample.line, redirects, sample.redirects)
		}
	}
}

func TestALineNoShellCanReadGivesItsErrorAndNoCommands(t *testing.T) {
	for _, line := range []string{`echo "open`, "echo 'open", "a && && b", "(echo x"} {
		commands, _, err := Split(line)
		if err == nil || commands != nil {
			t.Errorf("split(%q) gave %v, %v", line, commands, err)
		}
	}
}
