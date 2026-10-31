// Command journal-hook is the hook the agent programs run: it reads the hook body on stdin, prepares the HookEvent,
// hands it to the journal's Python server and prints the answer. Run as journal-hook <program> <project root>, or as
// journal-hook --status <project root> by Claude Code's status line.
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
	"github.com/jessegall/agent-journal/tools/journal-hook/timing"
)

// version is set by the release build with -ldflags "-X main.version=<version>".
var version = "dev"

func main() {
	if len(os.Args) == 2 && os.Args[1] == "--version" {
		fmt.Println("journal-hook " + version)
		return
	}
	if len(os.Args) == 3 && os.Args[1] == "--status" {
		KeepStatus(os.Stdin, os.Args[2])
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
		os.Exit(0)
	}
	body, err := io.ReadAll(os.Stdin)
	if err != nil {
		os.Exit(0)
	}
	prepared, skip, err := programs.Prepared(program, body, context)
	if skip || err != nil {
		os.Exit(0)
	}
	object, err := json.Marshal(prepared)
	if err != nil {
		os.Exit(0)
	}
	limit := LimitFor(prepared.Event)
	status, answer := post(delivery{
		root:        root,
		program:     program,
		event:       prepared.Event,
		environment: context.Environment,
		actor:       context.Actor,
		actorToken:  os.Getenv("JOURNAL_ACTOR_TOKEN"),
		launch:      os.Getenv("JOURNAL_LAUNCH"),
		firing:      context.Firing,
		firedAtMs:   context.FiredAtMs,
		body:        object,
		limit:       limit,
		timing:      requestTiming,
	}, nil, time.Now())
	os.Exit(Answered(os.Stdout, os.Stderr, context.Programs.Programs[program], hookName(body), prepared.Event, status, answer, root, limit))
}

// hookName is the name the program gave the hook, which its answer repeats.
func hookName(body []byte) string {
	var read struct {
		HookEventName string `json:"hook_event_name"`
	}
	json.Unmarshal(body, &read)
	return read.HookEventName
}
