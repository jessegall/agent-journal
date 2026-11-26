package host

import (
	"context"
	"strconv"

	"github.com/charmbracelet/x/ansi"
	"github.com/moby/moby/client"
)

// lastLinesLimit is how many characters of a program's last lines are kept as the reason it ended.
const lastLinesLimit = 1000

// ExitOf waits until the container's program ends and answers how: its exit code, whether the kernel killed it for
// its memory, and the last lines it printed, as plain text.
func (containers Containers) ExitOf(ctx context.Context, name string) (ContainerExit, error) {
	code, err := containers.exitCodeOf(ctx, name)
	if err != nil {
		return ContainerExit{}, err
	}

	exit := ContainerExit{Code: code}
	inspected, err := containers.Daemon.ContainerInspect(ctx, name, client.ContainerInspectOptions{})
	if err != nil {
		return exit, nil
	}

	described := inspected.Container
	exit.OutOfMemory = described.State != nil && described.State.OOMKilled
	if code != 0 {
		hasTerminal := described.Config != nil && described.Config.Tty
		exit.LastLines = lastCharacters(ansi.Strip(containers.lastPrinted(ctx, name, hasTerminal)), lastLinesLimit)
	}

	return exit, nil
}

// lastCharacters are the text's last characters, at most the limit.
func lastCharacters(text string, limit int) string {
	characters := []rune(text)
	if len(characters) <= limit {
		return text
	}

	return string(characters[len(characters)-limit:])
}

// ContainerExit is how a session container's program ended: its exit code, whether the kernel killed it for using
// more memory than its budget, and the last lines it printed.
type ContainerExit struct {
	Code        int
	OutOfMemory bool
	LastLines   string
}

// Evidence is the exit as the host reports it to the journal, with the program's own last lines as the reason when
// it printed any.
func (exit ContainerExit) Evidence() string {
	if exit.OutOfMemory {
		return "the session container was killed for using more memory than its budget"
	}

	evidence := "the session container's program exited with " + strconv.Itoa(exit.Code)
	if exit.LastLines == "" {
		return evidence
	}

	return evidence + ": " + exit.LastLines
}
