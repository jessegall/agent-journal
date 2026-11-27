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
}

// Script is what a mock program answers, step by step: each step is the method of the next line the program must
// hear and what it does on hearing it. A test writes it from recordings by their names; anything else heard fails.
type Script struct {
	// Program names the mock in a failure, such as "codex app-server".
	Program string `json:"program"`
	// Opening is the recording whose lines printed before any input open the answer; none when empty.
	Opening string `json:"opening"`
	// ExitCode is what the mock exits with once its input ends.
	ExitCode int `json:"exitCode"`
	// EndsAfterLast ends the mock once its last step is answered, as a login does.
	EndsAfterLast bool         `json:"endsAfterLast"`
	Steps         []ScriptStep `json:"steps"`
}

// ScriptStep is one line the mock expects to hear, by its method, and its answer, played in order.
type ScriptStep struct {
	Method  string         `json:"method"`
	Actions []ScriptAction `json:"actions"`
}

// ScriptAction is one part of an answer: a reply or a notification from a recording, or a wait for a test's step.
type ScriptAction struct {
	// Type is reply, notify or wait.
	Type      string `json:"type"`
	Recording string `json:"recording"`
	// Method is the notification's method, for notify.
	Method string `json:"method"`
	// Step is the test's step a wait waits for, for wait.
	Step string `json:"step"`
}

// ScriptFailure is a line the mock heard that its script did not expect, at the step it was on.
type ScriptFailure struct {
	Program  string `json:"program"`
	Position int    `json:"position"`
	Story    string `json:"story"`
	Expected string `json:"expected"`
	Got      string `json:"got"`
}

// ScriptPlace keeps what a mock shares with its test across its starts: how many steps it answered, the test's steps
// that ran and the failure it writes for an unexpected line.
type ScriptPlace interface {
	// Played is how many of the script's steps a start before this one answered.
	Played() int
	// Answered notes that the steps up to this count are answered.
	Answered(count int)
	// HasRun answers whether the test's step of this name ran.
	HasRun(step string) bool
	// Story names the test's step running now, for a failure.
	Story() string
	// Failed hands the test the line the script did not expect.
	Failed(failure ScriptFailure)
}

// scriptPause is how often a wait looks again for the test's step it waits on.
const scriptPause = 20 * time.Millisecond

// ScriptReplay answers a pipe program's input as its script says, in order, from where an earlier start of it left
// off: each line heard must be the method of the next step, whose replies and notifications come from the recordings
// it names, with the values the heard line holds in place of the recorded ones, and whose waits hold the rest of the
// answer until the test's step ran, while further lines are read. A line the script did not expect is handed to the
// place as a failure, and the replay ends with an error.
func ScriptReplay(
	script Script,
	place ScriptPlace,
	input io.Reader,
	output io.Writer,
	errorOutput io.Writer,
	environment func(string) string,
	heard func(line string),
) error {
	recordings := &scriptRecordings{loaded: map[string]recordedExchange{}, plays: map[string]int{}}
	if script.Opening != "" {
		opening, err := recordings.of(script.Opening)
		if err != nil {
			return err
		}
		streams := map[string]io.Writer{"stdout": output, "stderr": errorOutput}
		for _, line := range opening.opening {
			if _, err := io.WriteString(streams[line.stream], withEnvironment(line.text, environment)); err != nil {
				return err
			}
		}
	}
	answers := &lockedWriter{output: output}
	position := place.Played()
	lines := bufio.NewScanner(input)
	lines.Buffer(make([]byte, 0, 64*1024), 16*1024*1024)
	for lines.Scan() {
		written := lines.Text()
		heard(written)
		if position >= len(script.Steps) || script.Steps[position].Method != methodOf(written) {
			return unexpected(script, place, position, written)
		}
		step := script.Steps[position]
		position++
		place.Answered(position)
		answer, err := recordings.answerOf(step, written, environment)
		if err != nil {
			return err
		}
		last := script.EndsAfterLast && position == len(script.Steps)
		if last {
			answer.play(answers, place)
			break
		}
		go answer.play(answers, place)
	}
	// The program ends with its input, as the recorded one did: an answer still under way is cut off.
	return lines.Err()
}

// unexpected hands the place the line the script did not expect at its position, and ends the replay with it.
func unexpected(script Script, place ScriptPlace, position int, written string) error {
	expected := "nothing more"
	if position < len(script.Steps) {
		expected = script.Steps[position].Method
	}
	failure := ScriptFailure{
		Program:  script.Program,
		Position: position + 1,
		Story:    place.Story(),
		Expected: expected,
		Got:      written,
	}
	place.Failed(failure)
	return fmt.Errorf(
		"the %s mock expected %s at its step %d, while the test was at %s, and heard: %s",
		script.Program, expected, failure.Position, failure.Story, written,
	)
}

// scriptAnswer is the lines and waits of one step's answer, in the order its script gives them.
type scriptAnswer struct {
	parts []scriptPart
}

// scriptPart is lines to write, or a test's step to wait for when it holds no lines.
type scriptPart struct {
	lines []string
	step  string
}

// play writes the answer's parts in order, waiting where a part waits for a test's step.
func (answer scriptAnswer) play(answers *lockedWriter, place ScriptPlace) {
	for _, part := range answer.parts {
		for part.step != "" && !place.HasRun(part.step) {
			time.Sleep(scriptPause)
		}
		_ = answers.write(part.lines)
	}
}

// recordedExchange is a recording cut into what it printed before any input and one step per line written to it.
type recordedExchange struct {
	opening []openingLine
	steps   []exchangeStep
}

// scriptRecordings loads each recording a script names once, and counts how often each recorded step was played.
type scriptRecordings struct {
	loaded map[string]recordedExchange
	plays  map[string]int
}

func (recordings *scriptRecordings) of(folder string) (recordedExchange, error) {
	if exchange, isLoaded := recordings.loaded[folder]; isLoaded {
		return exchange, nil
	}
	fixture, err := Load(folder)
	if err != nil {
		return recordedExchange{}, err
	}
	opening, steps := exchangeSteps(fixture)
	exchange := recordedExchange{opening: opening, steps: steps}
	recordings.loaded[folder] = exchange
	return exchange, nil
}

// answerOf is the answer the step's actions give the written line: a reply is the recorded answer to the first
// recorded line of the step's method, up to and with the reply to its id; a notification is each recorded line of
// its method after that reply.
func (recordings *scriptRecordings) answerOf(step ScriptStep, written string, environment func(string) string) (scriptAnswer, error) {
	answer := scriptAnswer{}
	for _, action := range step.Actions {
		if action.Type == "wait" {
			answer.parts = append(answer.parts, scriptPart{step: action.Step})
			continue
		}
		exchange, err := recordings.of(action.Recording)
		if err != nil {
			return answer, err
		}
		number := recordedStepOf(exchange.steps, step.Method)
		if number < 0 {
			return answer, fmt.Errorf("the recording %s holds no line of %s", action.Recording, step.Method)
		}
		key := action.Recording + "\x00" + step.Method
		if action.Type == "reply" {
			recordings.plays[key]++
		}
		lines := answerOf(exchange.steps[number], written, max(recordings.plays[key], 1))
		reply, rest := splitReply(lines, idOf(written))
		chosen := reply
		if action.Type == "notify" {
			chosen = slices.DeleteFunc(slices.Clone(rest), func(line string) bool { return methodOf(line) != action.Method })
		}
		for index, line := range chosen {
			chosen[index] = withEnvironment(line, environment)
		}
		answer.parts = append(answer.parts, scriptPart{lines: chosen})
	}
	return answer, nil
}

// recordedStepOf is the recorded step of the first line of the method.
func recordedStepOf(steps []exchangeStep, method string) int {
	for number, step := range steps {
		if step.method == method {
			return number
		}
	}
	return -1
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
	for _, chunk := range fixture.Output {
		for next < len(inputs) && inputs[next].Offset <= chunk.Offset {
			written.Write(inputs[next].Bytes)
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
		for _, line := range lines {
			// A line the program printed in two chunks is one line.
			if count := len(step.printed); count > 0 && !strings.HasSuffix(step.printed[count-1], "\n") {
				step.printed[count-1] += line
				continue
			}
			step.printed = append(step.printed, line)
		}
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

// splitReply parts an answer at the reply to the written request: the reply and what came before it, and the rest.
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
