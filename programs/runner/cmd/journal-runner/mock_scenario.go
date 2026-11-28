//go:build mock

package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"slices"
	"strings"
	"time"

	"journal-runner/recorded"
	"journal-runner/recording"

	"golang.org/x/term"
)

// errNoModel refuses a start that names no model, as the real program would run on its own default.
var errNoModel = errors.New("the start names no model")

// mockScenario plays a recorded scenario in place of the driver it was recorded from: the driver exchange whose
// recorded command ends with this start's arguments, played by what is typed into it, with each recorded hook run
// at its place as the start's settings configure it, on the native body the driver sent.
//
//	journal-runner mock scenario --scenario <driver>/<name> -- <the driver's arguments>
func mockScenario(arguments []string) error {
	flags := flag.NewFlagSet("mock scenario", flag.ContinueOnError)
	named := flags.String("scenario", "", "the recorded scenario to play, as <driver>/<name>")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	argv := flags.Args()
	driver, name, isNamed := strings.Cut(*named, "/")
	if !isNamed {
		return fmt.Errorf("name the scenario as <driver>/<name>, not %q", *named)
	}
	if err := assertModelNamed(argv); err != nil {
		return err
	}
	root, err := recorded.Root()
	if err != nil {
		return err
	}
	scenario, err := recorded.Load(root, driver, name)
	if err != nil {
		return err
	}
	exchange, err := exchangeRunning(scenario, argv)
	if err != nil {
		return err
	}
	hooks, err := recordedHooksOf(scenario, exchange, settingsOf(argv))
	if err != nil {
		return err
	}
	if !term.IsTerminal(int(os.Stdin.Fd())) {
		return playExchange(exchange, os.Stdin, os.Stdout, hooks)
	}
	// Raw, as the program it stands in for: the terminal echoes nothing and hands each key on as it was typed.
	previous, err := term.MakeRaw(int(os.Stdin.Fd()))
	if err != nil {
		return err
	}
	defer func() { _ = term.Restore(int(os.Stdin.Fd()), previous) }()
	return playExchange(exchange, os.Stdin, os.Stdout, hooks)
}

// assertModelNamed refuses a Claude Code start whose arguments name no model, naming what is missing.
func assertModelNamed(argv []string) error {
	if slices.Contains(argv, "--version") || slices.Contains(argv, "auth") || slices.Contains(argv, "login") {
		return nil
	}
	if !slices.Contains(argv, "--model") {
		return fmt.Errorf("%w: %s", errNoModel, strings.Join(argv, " "))
	}
	return nil
}

// exchangeRunning is the scenario's driver exchange whose recorded command ends with the start's arguments.
func exchangeRunning(scenario recorded.Scenario, argv []string) (recorded.Exchange, error) {
	for _, exchange := range scenario.ExchangesOn(recording.WireDriver) {
		recordedArgv := exchange.Opening.Argv
		if len(argv) > 0 && len(argv) <= len(recordedArgv) && slices.Equal(recordedArgv[len(recordedArgv)-len(argv):], argv) {
			return exchange, nil
		}
	}
	return recorded.Exchange{}, fmt.Errorf("the scenario %s ran no driver program as %s", scenario.Name, strings.Join(argv, " "))
}

// playExchange plays the exchange's recorded output by what is typed into it, running each hook at its place.
func playExchange(exchange recorded.Exchange, input io.Reader, output io.Writer, hooks []recordedHook) error {
	fixture, err := recording.Load(exchange.Folder)
	if err != nil {
		return err
	}
	following := &hookedOutput{output: output, hooks: hooks}
	if err := recording.GatedReplay(fixture, input, following, mockPause, func(recording.Typed) error { return nil }); err != nil {
		return err
	}
	return following.runUpTo(time.Duration(1 << 62))
}

// recordedHook is one hook the driver ran while recorded: when, after its program started, and with which command
// and native body.
type recordedHook struct {
	offset  time.Duration
	command string
	body    []byte
}

// hookedOutput writes the played output and runs each recorded hook once the output reaches its moment.
type hookedOutput struct {
	output io.Writer
	hooks  []recordedHook
	ran    int
}

func (hooked *hookedOutput) Write(piece []byte) (int, error) {
	return hooked.output.Write(piece)
}

func (hooked *hookedOutput) Reached(offset time.Duration) error {
	return hooked.runUpTo(offset)
}

func (hooked *hookedOutput) runUpTo(offset time.Duration) error {
	for hooked.ran < len(hooked.hooks) && hooked.hooks[hooked.ran].offset <= offset {
		hook := hooked.hooks[hooked.ran]
		hooked.ran++
		run := exec.Command("/bin/sh", "-c", hook.command)
		run.Stdin = bytes.NewReader(hook.body)
		run.Env = os.Environ()
		// A hook's answer is the journal's to act on; a failing hook leaves the turn as the live one left it.
		_ = run.Run()
	}
	return nil
}

// settingsOf is the settings file the start names, none when it names none.
func settingsOf(argv []string) string {
	index := slices.Index(argv, "--settings")
	if index < 0 || index+1 >= len(argv) {
		return ""
	}
	return argv[index+1]
}

// recordedHooksOf are the hooks the scenario recorded while the exchange's program ran, each with the command the
// start's settings configure for its event, in order; with no settings file there are none.
func recordedHooksOf(scenario recorded.Scenario, exchange recorded.Exchange, settingsFile string) ([]recordedHook, error) {
	if settingsFile == "" {
		return nil, nil
	}
	commands, err := hookCommands(settingsFile)
	if err != nil {
		return nil, err
	}
	calls, err := scenario.Calls(recording.WireHooks)
	if err != nil {
		return nil, err
	}
	opened := time.Duration(exchange.Opening.OpenedAt) * time.Microsecond
	hooks := []recordedHook{}
	for _, call := range calls {
		body, _ := base64.StdEncoding.DecodeString(call.Asked.Body)
		var native struct {
			Event string `json:"hook_event_name"`
		}
		if json.Unmarshal(body, &native) != nil || commands[native.Event] == "" {
			continue
		}
		asked := time.Duration(call.AskedAt) * time.Microsecond
		hooks = append(hooks, recordedHook{offset: asked - opened, command: commands[native.Event], body: body})
	}
	return hooks, nil
}

// hookCommands are the commands the settings file runs for each hook event, the first command of each.
func hookCommands(settingsFile string) (map[string]string, error) {
	content, err := os.ReadFile(settingsFile)
	if err != nil {
		return nil, err
	}
	var settings struct {
		Hooks map[string][]struct {
			Hooks []struct {
				Type    string `json:"type"`
				Command string `json:"command"`
			} `json:"hooks"`
		} `json:"hooks"`
	}
	if err := json.Unmarshal(content, &settings); err != nil {
		return nil, fmt.Errorf("reading the start's settings %s: %w", settingsFile, err)
	}
	commands := map[string]string{}
	for event, groups := range settings.Hooks {
		for _, group := range groups {
			for _, hook := range group.Hooks {
				if hook.Type == "command" && commands[event] == "" {
					commands[event] = hook.Command
				}
			}
		}
	}
	return commands, nil
}
