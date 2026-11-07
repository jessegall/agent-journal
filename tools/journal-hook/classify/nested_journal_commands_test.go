package classify

import (
	"reflect"
	"testing"
)

func TestNestedJournalCommandsFollowShellSyntax(t *testing.T) {
	for _, sample := range []struct {
		line string
		want [][]string
	}{
		{"journal message reply 1 'Use `journal task overview 1` when 2 > 1'", nil},
		{"echo $(journal task overview 1)", [][]string{{"task", "overview", "1"}}},
		{"echo \"`journal task overview 1`\"", [][]string{{"task", "overview", "1"}}},
		{"{ journal task overview 1; } > /tmp/task", [][]string{{"task", "overview", "1"}}},
		{"sh -c 'journal task overview 1'", [][]string{{"task", "overview", "1"}}},
	} {
		got := nestedJournalCommands(sample.line)
		if !reflect.DeepEqual(got, sample.want) {
			t.Errorf("%q: got %v, want %v", sample.line, got, sample.want)
		}
	}
}
