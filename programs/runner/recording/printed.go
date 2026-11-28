package recording

import (
	"io"
	"regexp"
	"strings"
)

// environmentValue finds a value a recording names by its environment variable, such as {env:PROGRAM_HOME}, as a
// recording keeps no value of the machine it was made on.
var environmentValue = regexp.MustCompile(`\{env:([A-Z_][A-Z0-9_]*)\}`)

// Printed is everything the recorded program printed on its output stream, with each value the recording names by
// its environment variable taken from the environment given, as a program that only prints and exits answers.
func (fixture Fixture) Printed(environment func(string) string) string {
	var printed strings.Builder
	for _, chunk := range fixture.Output {
		if chunk.Stream == "stdout" {
			printed.Write(chunk.Bytes)
		}
	}
	return withEnvironment(printed.String(), environment)
}

// PrintAll writes everything the recorded program printed, each chunk on its own stream, with each value the
// recording names by its environment variable taken from the environment given.
func (fixture Fixture) PrintAll(output io.Writer, errorOutput io.Writer, environment func(string) string) error {
	streams := map[string]io.Writer{"stdout": output, "stderr": errorOutput}
	for _, chunk := range fixture.Output {
		if _, err := io.WriteString(streams[chunk.Stream], withEnvironment(string(chunk.Bytes), environment)); err != nil {
			return err
		}
	}
	return nil
}

func withEnvironment(line string, environment func(string) string) string {
	return environmentValue.ReplaceAllStringFunc(line, func(named string) string {
		return environment(environmentValue.FindStringSubmatch(named)[1])
	})
}
