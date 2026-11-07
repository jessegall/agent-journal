package main

import (
	"strings"
	"testing"
)

const longOutput = "head -c 1000 /dev/zero | tr '\\0' x"

func TestAnOutputUnderTheCapIsShownWhole(t *testing.T) {
	output, _ := run(t, options(t, "echo short"), newClient())
	if output != "short\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestAnOutputPastTheCapIsShownAsALineNamingItAndWhatToReadItWith(t *testing.T) {
	output, _ := run(t, options(t, longOutput), newClient())
	if strings.Count(output, "x") > 400 || !strings.Contains(output, "output 4 is 1 lines, 1000 characters: journal output read 4 --summary") {
		t.Fatalf("printed %q", output)
	}
}

func TestALineOfJournalCommandsIsShownWholeWhateverItsSize(t *testing.T) {
	setup := options(t, longOutput)
	setup.LimitSeconds = 0
	output, _ := run(t, setup, newClient())
	if strings.Count(output, "x") != 1000 {
		t.Fatalf("printed %d characters", strings.Count(output, "x"))
	}
}

func TestPastTheCapTheTailIsShownFirstAndThenTheLineNamingTheOutput(t *testing.T) {
	output, _ := run(t, options(t, "seq 1 400"), newClient())
	lines := strings.Split(strings.TrimRight(output, "\n"), "\n")
	if lines[len(lines)-2] != "400" || !strings.HasPrefix(lines[len(lines)-1], "output 4 is 400 lines") || len(output) > 400 {
		t.Fatalf("printed %q", output)
	}
}
