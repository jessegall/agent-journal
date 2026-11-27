package recording

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"regexp"
	"slices"
	"strings"
	"sync"
	"time"
)

// environmentValue finds a value a recording names by its environment variable, such as {env:CODEX_HOME}, as a
// recording keeps no value of the machine it was made on.
var environmentValue = regexp.MustCompile(`\{env:([A-Z_][A-Z0-9_]*)\}`)

// recordedIdentifier finds the identifiers a program makes up, such as a thread's or a turn's, in what it printed.
var recordedIdentifier = regexp.MustCompile(`[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`)

// minimumReplacedLength is the shortest recorded value the written one takes the place of in an answer.
const minimumReplacedLength = 4

// openingLine is a line the program printed before anything was written to it, on the stream it printed it on.
type openingLine struct {
	stream string
	text   string
}

// exchangeStep is one line written to a recorded pipe program and every line it printed until the next was written.
type exchangeStep struct {
	written string
	method  string
	printed []string
	// waits holds, for each printed line, how long the program took to print it after the line before, at most
	// longestWait.
	waits []time.Duration
}

// longestWait is the longest a replay waits between two printed lines, so a recording plays in a moment; what must
// wait on the journal or a test, such as a sign-in the user completes, waits on holdBefore instead.
const longestWait = 20 * time.Millisecond

// ExchangeReplay answers a pipe program's input as the recorded programs did, the steps of every recording together
// and the opening of the first: what it printed before its first input
// first, then for each line written the lines it printed after the first recorded line of the same method. The values the
// written line holds in place of the recorded ones, such as a request id or a thread, are put in the answer, and
// identifiers an answer makes up are new ones each time it is played again. The reply to a written request comes at
// once, and heard is told each written line; the rest of its answer follows while further lines are read, and waits on holdBefore with each line's method,
// so a test can keep a turn running or a sign-in waiting. A recording with no input plays whole, holding after holdAfter lines. Each
// value the recording names by its environment variable is the variable's value here. A program that ends by itself
// once its last recorded line was written, as a login does, ends then.
func ExchangeReplay(
	fixtures []Fixture,
	input io.Reader,
	output io.Writer,
	errorOutput io.Writer,
	environment func(string) string,
	heard func(line string),
	holdBefore func(method string),
	holdAfter int,
	hold func(),
	endsAfterLast bool,
) error {
	opening, steps := exchangeSteps(fixtures[0])
	for _, more := range fixtures[1:] {
		_, moreSteps := exchangeSteps(more)
		steps = append(steps, moreSteps...)
	}
	streams := map[string]io.Writer{"stdout": output, "stderr": errorOutput}
	for number, line := range opening {
		if number == holdAfter {
			hold()
		}
		if _, err := io.WriteString(streams[line.stream], withEnvironment(line.text, environment)); err != nil {
			return err
		}
	}
	if len(steps) == 0 {
		return nil
	}
	answers := &lockedWriter{output: output}
	played := map[int]int{}
	lines := bufio.NewScanner(input)
	lines.Buffer(make([]byte, 0, 64*1024), 16*1024*1024)
	for lines.Scan() {
		written := lines.Text()
		heard(written)
		number := stepFor(steps, methodOf(written))
		if number < 0 {
			continue
		}
		played[number]++
		answer := answerOf(steps[number], written, played[number])
		for line, text := range answer {
			answer[line] = withEnvironment(text, environment)
		}
		reply, rest := splitReply(answer, idOf(written))
		waits := steps[number].waits[len(reply):]
		if err := answers.write(reply); err != nil {
			return err
		}
		if endsAfterLast && number == len(steps)-1 {
			if err := answers.write(rest); err != nil {
				return err
			}
			break
		}
		go func() {
			for number, line := range rest {
				time.Sleep(waits[number])
				holdBefore(methodOf(line))
				_ = answers.write([]string{line})
			}
		}()
	}
	// The program ends with its input, as the recorded one did: an answer still under way is cut off.
	return lines.Err()
}

// answerOf is the step's recorded answer for this written line on its nth play, as lines.
func answerOf(step exchangeStep, written string, play int) []string {
	values := map[string]string{}
	valuesOf(step.written, written, values)
	answer := strings.Join(step.printed, "")
	if play > 1 {
		renewIdentifiers(answer, step.written, play, values)
	}
	for recorded, live := range values {
		answer = strings.ReplaceAll(answer, recorded, live)
	}
	lines := slices.DeleteFunc(strings.SplitAfter(answer, "\n"), func(line string) bool { return line == "" })
	// The reply carries the written request's id, a number or a string, whatever the recorded one was.
	recordedID, writtenID := idOf(step.written), idOf(written)
	for number, line := range lines {
		if recordedID != "" && idOf(line) == recordedID {
			lines[number] = strings.Replace(line, `"id":`+recordedID, `"id":`+writtenID, 1)
		}
	}
	return lines
}

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

func withEnvironment(line string, environment func(string) string) string {
	return environmentValue.ReplaceAllStringFunc(line, func(named string) string {
		return environment(environmentValue.FindStringSubmatch(named)[1])
	})
}

// lockedWriter writes whole lines from answers that run side by side.
type lockedWriter struct {
	mutex  sync.Mutex
	output io.Writer
}

func (writer *lockedWriter) write(lines []string) error {
	writer.mutex.Lock()
	defer writer.mutex.Unlock()
	return writeLines(writer.output, lines)
}

// exchangeSteps cuts the recording into what it printed before any input and one step per line written to it.
func exchangeSteps(fixture Fixture) ([]openingLine, []exchangeStep) {
	var opening []openingLine
	var steps []exchangeStep
	inputs := slices.Clone(fixture.Inputs)
	written := strings.Builder{}
	next := 0
	var last time.Duration
	for _, chunk := range fixture.Output {
		for next < len(inputs) && inputs[next].Offset <= chunk.Offset {
			written.Write(inputs[next].Bytes)
			last = inputs[next].Offset
			next++
			for _, line := range completeLines(&written) {
				steps = append(steps, exchangeStep{written: line, method: methodOf(line)})
			}
		}
		lines := slices.DeleteFunc(strings.SplitAfter(string(chunk.Bytes), "\n"), func(line string) bool { return line == "" })
		if len(steps) == 0 {
			for _, line := range lines {
				opening = append(opening, openingLine{stream: chunk.Stream, text: line})
			}
			continue
		}
		// An answer is read on the output stream; what a program logs on its error stream while it serves is left out.
		if chunk.Stream != "stdout" {
			continue
		}
		step := &steps[len(steps)-1]
		for number, line := range lines {
			// A line the program printed in two chunks is one line.
			if count := len(step.printed); count > 0 && !strings.HasSuffix(step.printed[count-1], "\n") {
				step.printed[count-1] += line
				continue
			}
			wait := time.Duration(0)
			if number == 0 {
				wait = min(chunk.Offset-last, longestWait)
			}
			step.printed = append(step.printed, line)
			step.waits = append(step.waits, wait)
		}
		last = chunk.Offset
	}
	return opening, steps
}

// completeLines takes the whole lines written so far, leaving an unfinished one behind.
func completeLines(written *strings.Builder) []string {
	text := written.String()
	end := strings.LastIndex(text, "\n")
	if end < 0 {
		return nil
	}
	written.Reset()
	written.WriteString(text[end+1:])
	return strings.Split(text[:end], "\n")
}

// stepFor is the step a written line of the method is answered by: the first recorded line of that method, played
// again with new identifiers each time.
func stepFor(steps []exchangeStep, method string) int {
	for number, step := range steps {
		if step.method == method {
			return number
		}
	}
	return -1
}

func methodOf(line string) string {
	var message struct {
		Method string `json:"method"`
	}
	// A line of plain text, such as a code typed in, answers as the next text line was answered.
	if json.Unmarshal([]byte(line), &message) != nil {
		return ""
	}
	return message.Method
}

func idOf(line string) string {
	var message struct {
		ID json.RawMessage `json:"id"`
	}
	if json.Unmarshal([]byte(line), &message) != nil {
		return ""
	}
	return string(message.ID)
}

// valuesOf notes each string value of the written line that stands where the recorded line held another.
func valuesOf(recorded string, written string, live map[string]string) {
	var was, is any
	if json.Unmarshal([]byte(recorded), &was) != nil || json.Unmarshal([]byte(written), &is) != nil {
		return
	}
	pairValues(was, is, live)
}

func pairValues(was any, is any, live map[string]string) {
	switch recorded := was.(type) {
	case string:
		// A value too short to stand for itself alone, such as an empty one, is never replaced.
		if written, ok := is.(string); ok && written != recorded && len(recorded) >= minimumReplacedLength {
			live[recorded] = written
		}
	case map[string]any:
		written, ok := is.(map[string]any)
		if !ok {
			return
		}
		for key, value := range recorded {
			pairValues(value, written[key], live)
		}
	case []any:
		written, ok := is.([]any)
		if !ok {
			return
		}
		for index, value := range recorded {
			if index < len(written) {
				pairValues(value, written[index], live)
			}
		}
	}
}

// renewIdentifiers gives the identifiers an answer makes up new values for its nth play, so two threads started
// alike are two threads; one the written line names is kept.
func renewIdentifiers(answer string, written string, play int, values map[string]string) {
	for _, identifier := range recordedIdentifier.FindAllString(answer, -1) {
		if strings.Contains(written, identifier) {
			continue
		}
		sum := sha256.Sum256([]byte(fmt.Sprintf("%s/%d", identifier, play)))
		renewed := hex.EncodeToString(sum[:16])
		values[identifier] = renewed[:8] + "-" + renewed[8:12] + "-" + renewed[12:16] + "-" + renewed[16:20] + "-" + renewed[20:32]
	}
}

// splitReply parts an answer at the reply to the written request, so a hold comes after it.
func splitReply(lines []string, id string) ([]string, []string) {
	if id == "" {
		return lines, nil
	}
	for number, line := range lines {
		if idOf(line) == id {
			return lines[:number+1], lines[number+1:]
		}
	}
	return lines, nil
}

func writeLines(output io.Writer, lines []string) error {
	for _, line := range lines {
		if _, err := io.WriteString(output, line); err != nil {
			return err
		}
	}
	return nil
}
