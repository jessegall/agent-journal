package main

import (
	"fmt"
	"io"
	"path/filepath"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

const refusedWithoutReason = "Hook refused without a reason"

// projectHooksOnly runs the project's hooks in a session the journal does not handle, a plain program started in the
// project or an actor the journal skips, since their settings entries now live with the journal; it answers from
// them alone, as the program would have without the journal.
func projectHooksOnly(programName, root string, stdin io.Reader, stdout, stderr io.Writer) int {
	hooks := LoadManaged(filepath.Join(root, ".journal", "hooks", "managed.json"))
	if len(hooks) == 0 {
		return 0
	}
	body, err := io.ReadAll(stdin)
	if err != nil {
		return 0
	}
	table := programs.LoadTable(filepath.Join(root, ".journal", "programs.json"))
	runs := runManaged(Matching(hooks, programName, hookName(body), body, table), body, programName, root)
	decodeRuns(table.Programs[programName], table.Programs[programName].Events[hookName(body)], runs)
	return foreignAnswered(stdout, stderr, table.Programs[programName], hookName(body), runs)
}

// foreignAnswered prints the project hooks' answer in the program's own shape, for a hook that reaches no journal.
func foreignAnswered(stdout, stderr io.Writer, program programs.Program, hookName string, runs []ForeignRun) int {
	event := program.Events[hookName]
	stdoutText, stderrText, code := ProgramAnswer(program, hookName, event, foreignReply(program, event, runs))
	io.WriteString(stdout, stdoutText)
	io.WriteString(stderr, stderrText)
	return code
}

// foreignReply reads the project hooks' results into a reply, for the answers the journal's rule never saw them in:
// no journal, a stale registry, a busy database, a fault, an agent it does not know.
func foreignReply(program programs.Program, event string, runs []ForeignRun) Reply {
	reply := Reply{}
	for _, run := range runs {
		answer := run.Answer
		if reply.Refusal == "" {
			reply.Refusal = answer.Refusal
		}
		if len(reply.UpdatedInput) == 0 {
			reply.UpdatedInput = answer.UpdatedInput
		}
		reply.Lines = append(reply.Lines, answer.Lines...)
		reply.Terminal = joined(reply.Terminal, answer.Terminal)
	}
	if reply.Refusal != "" {
		reply.UpdatedInput = nil
	}
	return reply
}

func foreignRunReply(program programs.Program, event string, run ForeignRun) Reply {
	if run.TimedOut {
		return Reply{Terminal: run.ID + ": hook timed out"}
	}
	if run.ExitCode == 2 {
		return Reply{Refusal: withDefault(strings.TrimSpace(run.Stderr), refusedWithoutReason)}
	}
	if run.ExitCode != 0 {
		return Reply{Terminal: fmt.Sprintf("%s: hook exited with code %d: %s", run.ID, run.ExitCode, strings.TrimSpace(run.Stderr))}
	}
	stdout := strings.TrimSpace(run.Stdout)
	if stdout == "" {
		return Reply{}
	}
	answer, valid := nativeReply(program.Refusals[event], run.ID, stdout)
	if !valid {
		if program.TakesPlainOutput(event) {
			return Reply{Lines: strings.Split(stdout, "\n")}
		}
		return Reply{Terminal: run.ID + ": hook answer must be a JSON object"}
	}
	return answer
}

func withDefault(text, fallback string) string {
	if text == "" {
		return fallback
	}
	return text
}
