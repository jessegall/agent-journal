package host

import (
	"context"
	"io"
	"strings"
	"testing"

	"journal-runner/dockermock"
)

// A container whose manifest says it takes input holds its standard input open with no terminal: what is written to
// it reaches its program, closing it ends that input, and what the program printed is in its log.
func TestAContainerThatTakesInputReadsWhatIsWrittenWithNoTerminal(t *testing.T) {
	daemon := dockermock.Start(t, recordedImage)
	daemon.Programs = func(*dockermock.Container) dockermock.Program {
		return func(_ context.Context, _ *dockermock.Container, input io.Reader, output io.Writer) int {
			_, _ = io.Copy(output, input)

			return 0
		}
	}
	containers, err := containersRecordedInto(daemon.Host(), ContainerRules{Arrangement: Local}, recordedRun(t, false))
	if err != nil {
		t.Fatal(err)
	}
	ctx := context.Background()
	manifest := ContainerManifest{Name: "server", Image: recordedImage, Restart: "no", TakesInput: true}
	if _, err := containers.Create(ctx, manifest, ContainerProcess{Command: []string{"server"}}); err != nil {
		t.Fatal(err)
	}
	if err := containers.Start(ctx, "server"); err != nil {
		t.Fatal(err)
	}
	input, err := containers.AttachInput(ctx, "server")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := input.Write([]byte("{\"method\":\"initialize\"}\n")); err != nil {
		t.Fatal(err)
	}
	if err := input.Close(); err != nil {
		t.Fatal(err)
	}
	if _, err := containers.ExitOf(ctx, "server", 20, 4096); err != nil {
		t.Fatal(err)
	}
	printed, err := containers.FollowOutput(ctx, "server")
	if err != nil {
		t.Fatal(err)
	}
	defer printed.Close()
	piece, err := NextPrinted(printed)
	created, _ := daemon.Container("server")
	if err != nil || !strings.Contains(string(piece.Bytes), "initialize") || created.Config.Tty || !created.Config.OpenStdin {
		t.Fatalf("the server printed %q (%v); terminal %v, input open %v", piece.Bytes, err, created.Config.Tty,
			created.Config.OpenStdin)
	}
}

// An exit keeps only the last bytes the journal asks for of the lines it asks for, as a terminal's line can be a whole
// screen.
func TestAnExitKeepsAtMostTheLastBytesAskedForOfItsLog(t *testing.T) {
	daemon := dockermock.Start(t, recordedImage)
	daemon.Programs = func(*dockermock.Container) dockermock.Program {
		return func(_ context.Context, _ *dockermock.Container, _ io.Reader, output io.Writer) int {
			_, _ = io.WriteString(output, strings.Repeat("x", 10000)+"end")

			return 0
		}
	}
	containers, err := containersRecordedInto(daemon.Host(), ContainerRules{Arrangement: Local}, recordedRun(t, false))
	if err != nil {
		t.Fatal(err)
	}
	ctx := context.Background()
	manifest := ContainerManifest{Name: "screen", Image: recordedImage, Restart: "no"}
	if _, err := containers.Create(ctx, manifest, ContainerProcess{Command: []string{"screen"}}); err != nil {
		t.Fatal(err)
	}
	if err := containers.Start(ctx, "screen"); err != nil {
		t.Fatal(err)
	}
	exit, err := containers.ExitOf(ctx, "screen", 20, 100)
	if err != nil || len(exit.LastPrinted) != 100 || !strings.HasSuffix(exit.LastPrinted, "end") {
		t.Fatalf("the exit kept %d bytes ending %q (%v)", len(exit.LastPrinted), exit.LastPrinted[max(0, len(exit.LastPrinted)-5):], err)
	}
}
