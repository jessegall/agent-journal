package main

import (
	"strings"
	"testing"
)

const longOutput = "head -c 10000 /dev/zero | tr '\\0' x"

func TestAnOutputUnderTheCapIsShownWhole(t *testing.T) {
	output, _ := run(t, options(t, "echo short"), newClient())
	if output != "short\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestAnOutputPastTheCapIsShownAsALineNamingItAndWhatToReadItWith(t *testing.T) {
	output, _ := run(t, options(t, longOutput), newClient())
	if strings.Count(output, "x") > DefaultCapCharacters || !strings.Contains(output, "output 4 is 1 lines, 10000 characters: journal output read 4 --summary") {
		t.Fatalf("printed %q", output)
	}
}

func TestALineOfJournalCommandsIsShownWholeWhateverItsSize(t *testing.T) {
	setup := options(t, longOutput)
	setup.LimitSeconds = 0
	output, _ := run(t, setup, newClient())
	if strings.Count(output, "x") != 10000 {
		t.Fatalf("printed %d characters", strings.Count(output, "x"))
	}
}

func TestPastTheCapTheTailIsShownFirstAndThenTheLineNamingTheOutput(t *testing.T) {
	output, _ := run(t, options(t, "seq 1 4000"), newClient())
	lines := strings.Split(strings.TrimRight(output, "\n"), "\n")
	if lines[len(lines)-2] != "4000" || !strings.HasPrefix(lines[len(lines)-1], "output 4 is 4000 lines") || len(output) > DefaultCapCharacters {
		t.Fatalf("printed %q", output)
	}
}
