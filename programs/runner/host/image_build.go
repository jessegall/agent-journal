package host

import (
	"bufio"
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"time"

	"github.com/moby/moby/api/types/build"
	"github.com/moby/moby/client"
)

// buildStatus is one line of the stream Docker answers a build with: a BuildKit trace, the built image's id, plain
// output, or the error that ended the build.
type buildStatus struct {
	ID     string          `json:"id"`
	Aux    json.RawMessage `json:"aux"`
	Stream string          `json:"stream"`
	Error  string          `json:"error"`
}

// BuildImage has the Docker daemon build the image the journal signed, with BuildKit: the context as sent, the
// Dockerfile at its path in it, the base and build arguments as given, under the build's name. It answers Docker's
// facts: the image's config digest, the created_by of each layer, the build's output and an exit code that is 0 only
// for a built image. A daemon it cannot reach is ErrDaemonUnreachable.
func (containers Containers) BuildImage(ctx context.Context, plan ImageBuild) (ImageBuilt, error) {
	ctx, cancel := context.WithTimeout(ctx, time.Duration(plan.DeadlineMs)*time.Millisecond)
	defer cancel()
	answered, err := containers.Daemon.ImageBuild(ctx, bytes.NewReader(plan.Context), client.ImageBuildOptions{
		Tags: []string{plan.Name}, Dockerfile: plan.Dockerfile, BuildArgs: buildArgumentsOf(plan),
		Version: build.BuilderBuildKit, Remove: true, ForceRemove: true,
	})
	if err != nil {
		return ImageBuilt{}, unreachable(err)
	}
	defer answered.Body.Close()

	stdout := &boundedBuffer{limit: plan.OutputLimit}
	stderr := &boundedBuffer{limit: plan.OutputLimit}
	image, failure := readBuildStream(bufio.NewScanner(answered.Body), stdout, stderr)
	if failure != "" || image == "" {
		_, _ = stderr.WriteString(failure)
		return ImageBuilt{Stdout: stdout.String(), Stderr: stderr.String(), ExitCode: 1, History: []string{}}, nil
	}
	history, err := containers.historyOf(ctx, image)
	if err != nil {
		return ImageBuilt{}, err
	}

	return ImageBuilt{Image: image, History: history, Stdout: stdout.String(), Stderr: stderr.String()}, nil
}

// buildArgumentsOf are the build's arguments as Docker takes them, the base among them as BASE.
func buildArgumentsOf(plan ImageBuild) map[string]*string {
	arguments := map[string]*string{"BASE": &plan.Base}
	for _, argument := range plan.BuildArguments {
		arguments[argument.Name] = &argument.Value
	}
	return arguments
}

// readBuildStream reads Docker's build stream to its end: each log line of a step into stdout or stderr as the step
// printed it, and the built image's id or the error that ended the build.
func readBuildStream(lines *bufio.Scanner, stdout, stderr *boundedBuffer) (string, string) {
	lines.Buffer(make([]byte, 0, 64*1024), 16*1024*1024)
	image := ""
	for lines.Scan() {
		var status buildStatus
		if json.Unmarshal(lines.Bytes(), &status) != nil {
			continue
		}
		switch {
		case status.Error != "":
			return "", status.Error
		case status.ID == "moby.image.id":
			var built struct{ ID string }
			_ = json.Unmarshal(status.Aux, &built)
			image = built.ID
		case status.ID == "moby.buildkit.trace":
			writeTraceLogs(status.Aux, stdout, stderr)
		default:
			_, _ = stdout.WriteString(status.Stream)
		}
	}
	if err := lines.Err(); err != nil {
		return "", "the build's output could not be read: " + err.Error()
	}
	return image, ""
}

// writeTraceLogs writes the log lines of one BuildKit trace, a base64 protobuf StatusResponse, to the stream each was
// printed on: 1 is standard output, 2 standard error.
func writeTraceLogs(aux json.RawMessage, stdout, stderr *boundedBuffer) {
	var encoded string
	if json.Unmarshal(aux, &encoded) != nil {
		return
	}
	trace, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return
	}
	for _, log := range protobufField(trace, statusLogs) {
		stream := protobufNumber(log, logStream)
		for _, message := range protobufField(log, logMessage) {
			if stream == 2 {
				_, _ = stderr.Write(message)
				continue
			}
			_, _ = stdout.Write(message)
		}
	}
}

// historyOf is the created_by of each layer of the image, oldest first, as Docker keeps it.
func (containers Containers) historyOf(ctx context.Context, image string) ([]string, error) {
	answered, err := containers.Daemon.ImageHistory(ctx, image)
	if err != nil {
		return nil, fmt.Errorf("%w: the history of %s could not be read: %v", ErrDaemonUnreachable, image, err)
	}
	history := make([]string, 0, len(answered.Items))
	for index := len(answered.Items) - 1; index >= 0; index-- {
		history = append(history, answered.Items[index].CreatedBy)
	}
	return history, nil
}
