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

// dockerCommand finds Go code that runs the docker command line: a command started on the docker program, a docker
// program kept in a field, or docker followed by one of its subcommands as arguments.
var dockerCommand = regexp.MustCompile(
	`exec\.Command(Context)?\([^)]*"docker"` +
		`|Docker:\s*"docker"` +
		`|"docker",\s*"(run|create|start|stop|rm|ps|inspect|attach|wait|logs|kill|exec|info|image|volume|network)"`,
)

// DockerCommandsIn is every line of the source that runs the docker command line.
func DockerCommandsIn(name, source string) []string {
	found := []string{}
	for number, line := range strings.Split(source, "\n") {
		if dockerCommand.MatchString(line) {
			found = append(found, name+":"+strconv.Itoa(number+1)+": "+strings.TrimSpace(line))
		}
	}

	return found
}

// The host talks to Docker through Docker's own Go client, in its tests too,
// where the stand-in daemon answers that client. No Go code runs the docker command line or reads its text.
func TestNoGoCodeRunsTheDockerCommandLine(t *testing.T) {
	found := []string{}
	err := filepath.WalkDir("..", func(path string, entry fs.DirEntry, err error) error {
		if err != nil || entry.IsDir() || !strings.HasSuffix(path, ".go") {
			return err
		}
		relative := strings.TrimPrefix(filepath.ToSlash(path), "../")
		if relative == "architecture/docker_client_test.go" {
			return nil
		}
		source, readErr := os.ReadFile(path)
		if readErr != nil {
			return readErr
		}
		found = append(found, DockerCommandsIn(relative, string(source))...)

		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(found) > 0 {
		t.Fatalf("Go code runs the docker command line; ask the daemon through host.Containers instead:\n%s",
			strings.Join(found, "\n"))
	}
}

func TestTheCheckCatchesCodeThatRunsTheDockerCommandLine(t *testing.T) {
	fixture := "command := exec.CommandContext(ctx, \"docker\", \"ps\")\n" +
		"containers := Containers{Docker: \"docker\"}\n" +
		"arguments := []string{\"docker\", \"rm\", name}\n" +
		"socket := flags.String(\"docker\", \"\", \"the agent daemon's socket\")\n"

	if found := DockerCommandsIn("fixture.go", fixture); len(found) != 3 {
		t.Fatalf("the fixture's three docker commands were found as %v", found)
	}
}
