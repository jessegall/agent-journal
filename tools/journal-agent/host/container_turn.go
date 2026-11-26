package host

import (
	"context"
	"fmt"
	"io"

	"github.com/charmbracelet/x/ansi"
	"github.com/moby/moby/api/pkg/stdcopy"
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

// ContainerTurn is one turn of a program without a terminal, as its session container's own process: created, then
// started once, read while it runs, and ended by its exit, an interrupt or a stop.
type ContainerTurn struct {
	containers Containers
	name       string
	output     *io.PipeWriter
	copied     chan struct{}
}

// Output is what the program prints on its standard output, from its start to its end. It is asked for before Start
// and must be read to its end.
func (turn *ContainerTurn) Output() (io.Reader, error) {
	reader, writer := io.Pipe()
	turn.output = writer

	return reader, nil
}

// Start attaches to the container's output and starts its program.
func (turn *ContainerTurn) Start() error {
	ctx := context.Background()
	attached, err := turn.containers.Daemon.ContainerAttach(ctx, turn.name, client.ContainerAttachOptions{
		Stream: true, Stdout: true, Stderr: true,
	})
	if err != nil {
		return fmt.Errorf("attaching to the session container %s failed: %w", turn.name, err)
	}

	if _, err := turn.containers.Daemon.ContainerStart(ctx, turn.name, client.ContainerStartOptions{}); err != nil {
		attached.Close()

		return fmt.Errorf("starting the session container %s failed: %w", turn.name, err)
	}

	turn.copied = make(chan struct{})
	go func() {
		defer close(turn.copied)
		defer attached.Close()
		var printed io.Writer = io.Discard
		if turn.output != nil {
			printed = turn.output
			defer turn.output.Close()
		}
		_, _ = stdcopy.StdCopy(printed, io.Discard, attached.Reader)
	}()

	return nil
}

// Wait answers once the program ended and everything it printed was read: nil for exit code 0, and otherwise its
// exit code with its own last lines.
func (turn *ContainerTurn) Wait() error {
	<-turn.copied
	exit, err := turn.containers.ExitOf(context.Background(), turn.name)
	if err != nil {
		return err
	}

	if exit.Code == 0 {
		return nil
	}

	return fmt.Errorf("%w: %s", ExitedWith(exit.Code), exit.Evidence())
}

// Interrupt asks the program to end its turn, as Ctrl+C does.
func (turn *ContainerTurn) Interrupt() error {
	_, err := turn.containers.Daemon.ContainerKill(context.Background(), turn.name, client.ContainerKillOptions{
		Signal: "SIGINT",
	})

	return err
}

// Stop ends the program within the graceful bound, by force after it, and says the stop is proven only once the
// daemon shows the container not running.
func (turn *ContainerTurn) Stop(stages StopStages) StopOutcome {
	if turn.containers.Stop(context.Background(), turn.name, int(stages.Grace.Seconds())) != nil {
		return StopUnconfirmed
	}

	return StopProven
}
