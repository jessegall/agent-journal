// Command journal-hook is the hook the agent programs run: it reads the hook body on stdin, prepares the HookEvent,
// hands it to the journal's Python server and prints the answer. Run as journal-hook <program> <project root>, or as
// journal-hook --status <project root> by Claude Code's status line, or as journal-hook --file-scan <journal home>
// <owner flag> <owner> <folder> after a shell line or an edit tool.
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
)

// version is set by the release build with -ldflags "-X main.version=<version>".
var version = "dev"

func main() {
	if len(os.Args) == 3 && os.Args[1] == "--saved-command-conflict" {
		if err := savedCommandConflict(os.Stdin, os.Stdout, os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		return
	}
	if len(os.Args) == 2 && os.Args[1] == "--version" {
		fmt.Println("journal-hook " + version)
		return
	}
	if len(os.Args) == 3 && os.Args[1] == "--status" {
		KeepStatus(os.Stdin, os.Args[2])
		return
	}
	if len(os.Args) == 6 && os.Args[1] == "--file-scan" {
		ScanFiles(os.Args[2], os.Args[3], os.Args[4], os.Args[5])
		return
	}
	requestTiming := timing.Started()
	started := time.Now()
	if len(os.Args) < 3 {
		os.Exit(0)
	}
	program, root := os.Args[1], os.Args[2]
	folder, _ := os.Getwd()
	context, skip := hookContext(os.Getenv, root, folder, os.Getpid(), started)
	if skip {
		os.Exit(projectHooksOnly(program, root, os.Stdin, os.Stdout, os.Stderr))
	}
	requestTiming.Stamp("go_context")
	body, err := io.ReadAll(os.Stdin)
	if err != nil {
		os.Exit(0)
	}
	requestTiming.Stamp("go_stdin")
	prepared, skip, err := preparedHook(program, root, body, context)
	if err != nil && mustBeChecked(context.Role, context.Programs.Programs[program].Events[hookName(body)]) {
		os.Exit(Answered(os.Stdout, os.Stderr, context.Programs.Programs[program], hookName(body), "pre_tool_use", checkRequired, nil, root, LimitFor("pre_tool_use"), prepared.Foreign...))
	}
	if skip || err != nil {
		os.Exit(foreignAnswered(os.Stdout, os.Stderr, context.Programs.Programs[program], hookName(body), prepared.Foreign))
	}
	requestTiming.Stamp("go_prepared")
	scanAfterEdit(root, prepared)
	object, err := json.Marshal(prepared)
	if err != nil {
		os.Exit(0)
	}
	limit := limitOf(root, prepared.Event, context.Role)
	status, answer := postedUntilAnswered(delivery{
		root:        root,
		program:     program,
		event:       prepared.Event,
		environment: context.Environment,
		actor:       context.Actor,
		actorToken:  os.Getenv("JOURNAL_ACTOR_TOKEN"),
		launch:      os.Getenv("JOURNAL_LAUNCH"),
		role:        context.Role,
		firing:      context.Firing,
		firedAtMs:   context.FiredAtMs,
		body:        object,
		limit:       limit,
		timing:      requestTiming,
	}, nil, time.Now(), StopWindow, RetryPause)
	if status != http.StatusOK {
		if code, handled := answerWithoutServer(os.Stdout, os.Stderr, prepared.Event, prepared.Foreign); handled {
			os.Exit(code)
		}
		if status != restartTimedOut && mustBeChecked(context.Role, prepared.Event) {
			status = checkRequired
		}
	}
	os.Exit(Answered(os.Stdout, os.Stderr, context.Programs.Programs[program], hookName(body), prepared.Event, status, answer, root, limit, prepared.Foreign...))
}

func preparedHook(program, root string, body []byte, context programs.Context) (event.HookEvent, bool, error) {
	runs := make(chan []ForeignRun, 1)
	go func() {
		hooks := LoadManaged(filepath.Join(root, ".journal", "hooks", "managed.json"))
		runs <- runManaged(Matching(hooks, program, hookName(body), body, context.Programs), body)
	}()
	prepared, skip, err := programs.Prepared(program, body, context)
	prepared.Foreign = <-runs
	definition := context.Programs.Programs[program]
	decodeRuns(definition, definition.Events[hookName(body)], prepared.Foreign)
	return prepared, skip, err
}

// hookName is the name the program gave the hook, which its answer repeats.
func hookName(body []byte) string {
	var read struct {
		HookEventName string `json:"hook_event_name"`
	}
	json.Unmarshal(body, &read)
	return read.HookEventName
}
