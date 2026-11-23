package architecture

import (
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"testing"
)

// writtenStart finds a start written out field by field: a literal of the profiles' Start that is not the element
// type of a list or a map. A start is made from a BaseStart by Terminal, Turn or In.
var writtenStart = regexp.MustCompile(`(^|[^\]\w])\w*contracts\.Start\{`)

// writtenBase finds a base start written out by hand.
var writtenBase = regexp.MustCompile(`\w*contracts\.BaseStart\{`)

// startFunnel is where the host builds a runtime's base start from its grant; baseWithoutGrant is the direct run of
// a program for a recording, which has no grant.
const (
	startContracts   = "profiles/contracts/"
	hostCommands     = "cmd/journal-agent/"
	startFunnel      = "cmd/journal-agent/base_start.go"
	baseWithoutGrant = "cmd/journal-agent/main.go"
)

// StartsOutsideTheFunnelIn is every line of the source that builds a start outside the funnel: a Start written out
// anywhere, or, in the host's own commands, a BaseStart written out beside the funnel that builds it from the grant.
func StartsOutsideTheFunnelIn(name, source string) []string {
	found := []string{}
	isHostCommand := strings.HasPrefix(name, hostCommands) && !strings.HasSuffix(name, "_test.go")
	mayWriteBase := name == startFunnel || name == baseWithoutGrant

	for number, line := range strings.Split(source, "\n") {
		if writtenStart.MatchString(line) || (isHostCommand && !mayWriteBase && writtenBase.MatchString(line)) {
			found = append(found, name+":"+strconv.Itoa(number+1)+": "+strings.TrimSpace(line))
		}
	}

	return found
}

// User messages 19542 and 19549: a terminal start once left out the model a headless start had, because each place
// filled in its own start. Every start now comes from one base, and nothing writes a start beside it.
func TestEveryStartComesFromTheBaseStart(t *testing.T) {
	found := []string{}
	err := filepath.WalkDir("..", func(path string, entry fs.DirEntry, err error) error {
		relative := strings.TrimPrefix(filepath.ToSlash(path), "../")
		isChecked := strings.HasSuffix(path, ".go") && !strings.HasPrefix(relative, startContracts) &&
			!strings.HasPrefix(relative, "architecture/")
		if err != nil || entry.IsDir() || !isChecked {
			return err
		}
		source, readErr := os.ReadFile(path)
		if readErr != nil {
			return readErr
		}
		found = append(found, StartsOutsideTheFunnelIn(relative, string(source))...)

		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(found) > 0 {
		t.Fatalf("a start is built outside the funnel; take it from a BaseStart, and in the host from %s:\n%s",
			startFunnel, strings.Join(found, "\n"))
	}
}

func TestTheCheckCatchesAStartWrittenOutAndABaseBesideTheFunnel(t *testing.T) {
	written := "start := contracts.Start{Mode: recording.TerminalMode}\nstarts := []contracts.Start{one}\n"
	beside := "base := contracts.BaseStart{SessionID: id}\n"

	if found := StartsOutsideTheFunnelIn("drivers/some_driver.go", written); len(found) != 1 {
		t.Fatalf("a start written out was found %d times, want once: %v", len(found), found)
	}
	if found := StartsOutsideTheFunnelIn("cmd/journal-agent/host_commands.go", beside); len(found) != 1 {
		t.Fatalf("a base written beside the funnel was found %d times, want once: %v", len(found), found)
	}
	if found := StartsOutsideTheFunnelIn(startFunnel, beside); len(found) != 0 {
		t.Fatalf("the funnel itself was refused: %v", found)
	}
}
