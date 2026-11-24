package drivers

import (
	"context"
	"errors"
	"fmt"
	"log"
	"slices"
	"sync"
	"time"

	"journal-agent/drivers/contracts"
	"journal-agent/keyscripts"
	"journal-agent/screen"
	"journal-agent/terminal"
)

// interruptKey stops the running turn in both pinned programs (recorded in the terminal-interrupt fixtures).
const interruptKey = "\x1b"

// stopKeys end the program from its composer: the interrupt, then the end of input both programs exit on.
const stopKeys = "\x1b\x04"

// echoQuiet is how long the driver waits after the program drew a typed line before it presses Enter.
const echoQuiet = 150 * time.Millisecond

// enterKey submits the composer's line.
const enterKey = "\r"

// pollInterval is how often the driver reads the screen again while it waits.
const pollInterval = 50 * time.Millisecond

// TerminalRuntime is what the terminal driver drives: the screen read from the program, the gate every key passes,
// the program build's registered key scripts, the clock its waits run on, the process generation its reports carry,
// the relay its key scripts report their steps through, the layout a browser writer's prompt is classified by, and
// the runtime-owned hangup that stops the program without a key.
type TerminalRuntime struct {
	// ConversationID is the conversation the host started the program on.
	ConversationID    string
	Profile           string
	Classifier        *screen.Classifier
	Gate              *terminal.InputGate
	Composer          string
	Layout            screen.Layout
	Hangup            func() error
	EnterPrivate      func() bool
	ConfirmPrivateEnd func()
	Attachment        string
	Generation        func(region string) uint64
	Scripts           *keyscripts.Registry
	Runner            *keyscripts.Runner
	Clock             keyscripts.Clock
	ProcessGeneration int
	Progress          *ProgressRelay
	// Limits are the waits the journal sent with the start; the driver waits no longer than they say.
	Limits contracts.Limits
}

// TerminalDriver carries out the six operations on one persistent program in one process generation: every delivered
// prompt is a new turn of the same program, typed into an empty composer, never into an active turn.
type TerminalDriver struct {
	runtime     TerminalRuntime
	mutex       sync.Mutex
	turns       int
	interrupted bool
	turnEnd     *turnEnd
	// stalled is the key script run stopped for the main agent, which its rounds answer; nil while none is.
	stalled *stalledScript
}

// stalledScript is a key script run stopped on a screen it could not be certain of: that screen, the run's values,
// and the count of the user's inputs the main agent's next round must find unchanged.
type stalledScript struct {
	uncertainty keyscripts.Uncertainty
	values      map[string]string
	epoch       uint64
	// actions are every round's actions so far, and secret whether any round met a screen kept on the host.
	actions []keyscripts.ActionRecord
	secret  bool
}

// turnEnd is the end of one submitted prompt's turn, watched from the first time someone waits for it; seen is set,
// under the driver's lock, once the watch saw the turn end.
type turnEnd struct {
	ended chan contracts.TurnEnd
	watch sync.Once
	seen  bool
}

var _ contracts.AgentDriver = (*TerminalDriver)(nil)

var _ contracts.KeyScriptRunner = (*TerminalDriver)(nil)

func NewTerminalDriver(runtime TerminalRuntime) *TerminalDriver {
	return &TerminalDriver{runtime: runtime}
}

// Generation is the process generation of the one program the driver types into.
func (driver *TerminalDriver) Generation() int {
	return driver.runtime.ProcessGeneration
}

// NativeIdentity is the conversation the program runs, which the start's bootstrap proves to the journal.
func (driver *TerminalDriver) NativeIdentity() string {
	return driver.runtime.ConversationID
}

// Finished delivers the end of the last submitted prompt's turn: once the turn has taken the composer away, the
// composer is empty and still again. The program keeps running between turns. With no prompt submitted yet there is
// no turn to end, and the channel never delivers.
func (driver *TerminalDriver) Finished() <-chan contracts.TurnEnd {
	driver.mutex.Lock()
	current := driver.turnEnd
	driver.mutex.Unlock()
	if current == nil {
		return nil
	}
	current.watch.Do(func() { go driver.awaitTurnEnd(current) })

	return current.ended
}

// ReportProgressTo sends every step a key script confirms to the receiver.
func (driver *TerminalDriver) ReportProgressTo(receiver func(keyscripts.Progress)) {
	driver.runtime.Progress.SendTo(receiver)
}

// Turns is how many prompts the driver submitted in this generation.
func (driver *TerminalDriver) Turns() int {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	return driver.turns
}

func (driver *TerminalDriver) Deliver(
	_ context.Context,
	delivery contracts.Delivery,
) (contracts.OperationResult, error) {
	return driver.prompt(delivery.Request, contracts.PromptOf(delivery.Parts))
}

// Wake types the standard pending-work prompt, unless an interrupt holds the runtime: a held runtime does no work.
func (driver *TerminalDriver) Wake(_ context.Context, wake contracts.WakeRequest) (contracts.OperationResult, error) {
	return driver.prompt(wake.Request, wake.Prompt)
}

// ChangeModel stays staged: the recorded model picker reaches the wanted entry, but no recording shows a confirmed
// choice and its evidence, so nothing is applied live.
func (driver *TerminalDriver) ChangeModel(
	_ context.Context,
	change contracts.ModelChange,
) (contracts.OperationResult, error) {
	return staged(change.Request), nil
}

// ChangeEffort stays staged for the same reason: no recorded live path reaches evidence of the new effort.
func (driver *TerminalDriver) ChangeEffort(
	_ context.Context,
	change contracts.EffortChange,
) (contracts.OperationResult, error) {
	return staged(change.Request), nil
}

// Interrupt stops the running turn and holds the runtime until a user or a new delivery releases it. The turn is
// checked and the key sent under one lock, so a turn that ended, or another turn, gets no key: an interrupt of an
// ended turn answers already idle and never types into a composer that waits for the user.
func (driver *TerminalDriver) Interrupt(
	_ context.Context,
	interrupt contracts.InterruptRequest,
) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	defer driver.mutex.Unlock()

	if interrupt.Turn == 0 || interrupt.Turn != driver.turns || driver.turnEnd.seen {
		return alreadyIdle(interrupt.Request), nil
	}
	if err := driver.runtime.Gate.Keys(interruptKey); err != nil {
		return failed(interrupt.Request), err
	}

	driver.interrupted = true

	return contracts.OperationResult{
		Request:  interrupt.Request,
		Progress: contracts.ProgressApplying,
		Hold:     contracts.HoldInterrupted,
	}, nil
}

// Stop fences the input first, retiring a browser writer, any pending take and every queued input in one step, then
// ends the program through the runtime-owned hangup, which never types the draft, a stop key or Enter; a program
// with no hangup is stopped from its composer as before. The serving loop confirms the exit. A failed hangup keeps
// the input fenced so Retry stop finds nothing written meanwhile.
func (driver *TerminalDriver) Stop(_ context.Context, stop contracts.StopRequest) (contracts.OperationResult, error) {
	driver.runtime.Gate.FenceForStop()
	if driver.runtime.Hangup == nil {
		return driver.stopFromComposer(stop)
	}
	if err := driver.runtime.Hangup(); err != nil {
		return failed(stop.Request), err
	}

	return contracts.OperationResult{Request: stop.Request, Progress: contracts.ProgressApplying}, nil
}

// stopFromComposer types the stop keys through the fenced gate, for a program the host holds no PTY of.
func (driver *TerminalDriver) stopFromComposer(stop contracts.StopRequest) (contracts.OperationResult, error) {
	if err := driver.runtime.Gate.StopKeys(stopKeys); err != nil {
		return failed(stop.Request), err
	}

	return contracts.OperationResult{Request: stop.Request, Progress: contracts.ProgressApplying}, nil
}

// RunKeyScript runs a registered maintenance script of the program build through the gate.
func (driver *TerminalDriver) RunKeyScript(
	_ context.Context,
	request contracts.KeyScriptRequest,
) (contracts.OperationResult, error) {
	script, err := driver.runtime.Scripts.Find(driver.runtime.Profile, request.Script)
	if err != nil {
		return failed(request.Request), err
	}
	if refusal := bindingRefusal(script, request); refusal != nil {
		return failed(request.Request), refusal
	}

	result, err := driver.run(script, request)
	if result.Outcome == keyscripts.NavigationNeeded && result.Uncertainty != nil {
		driver.mutex.Lock()
		driver.stalled = &stalledScript{
			uncertainty: *result.Uncertainty,
			values:      request.Parameters,
			epoch:       result.Uncertainty.Epoch,
		}
		driver.mutex.Unlock()
	}

	return contracts.OperationResult{Request: request.Request, Progress: contracts.ProgressApplying, Script: &result}, err
}

// NavigateRound carries out a round of the main agent on the stalled key script's screen. With no stalled script, as
// after a restart, there is no live screen to answer and the round ends paused, for the user.
func (driver *TerminalDriver) NavigateRound(round keyscripts.Round) keyscripts.RoundResult {
	driver.mutex.Lock()
	stalled := driver.stalled
	driver.mutex.Unlock()
	if stalled == nil {
		return keyscripts.RoundResult{Paused: true}
	}

	result := driver.runtime.Runner.Navigate(round, stalled.epoch, stalled.uncertainty, stalled.values)
	driver.mutex.Lock()
	defer driver.mutex.Unlock()
	stalled.epoch = driver.runtime.Gate.UserInputs()
	stalled.actions = append(stalled.actions, result.Actions...)
	stalled.secret = stalled.secret || result.Refusal == keyscripts.RefusedSecretScreen
	if round.Proof != "" && result.HasObservedProof {
		path := keyscripts.ProvenPath{
			Actions:   stalled.actions,
			Secret:    stalled.secret,
			Proof:     round.Proof,
			Completes: round.Completes,
			NextStep:  round.NextStep,
		}
		if entry, err := path.Entry(); err == nil {
			result.Path = entry.Steps
		}
	}

	return result
}

// ReplayEntry replays a library entry the journal answered with, on the live screen, through the runner.
func (driver *TerminalDriver) ReplayEntry(entry keyscripts.Entry) (keyscripts.ReplayResult, error) {
	return driver.runtime.Runner.Replay(entry, driver.runtime.Profile)
}

// Reread reads a stalled key script's screen afresh, as the host does before it sends a raise again.
func (driver *TerminalDriver) Reread(stalled keyscripts.Uncertainty) (keyscripts.Uncertainty, bool) {
	return driver.runtime.Runner.Reread(stalled)
}

// run starts the script from its first step, or goes on from the step a stopped attempt reached.
func (driver *TerminalDriver) run(
	script keyscripts.KeyScript,
	request contracts.KeyScriptRequest,
) (keyscripts.Result, error) {
	if request.ResumeStep != nil {
		return driver.runtime.Runner.Resume(script, *request.ResumeStep, request.Parameters)
	}

	return driver.runtime.Runner.Run(script, request.Parameters)
}

// prompt types a prompt into an empty, still composer, waits for its echo and submits it once. An interrupted
// runtime or a composer that is not ready keeps the request staged; a lost echo makes it uncertain.
func (driver *TerminalDriver) prompt(
	request contracts.RequestIdentity,
	text string,
) (contracts.OperationResult, error) {
	driver.mutex.Lock()
	interrupted := driver.interrupted
	driver.mutex.Unlock()

	if interrupted {
		return contracts.OperationResult{
			Request:  request,
			Progress: contracts.ProgressStaged,
			Hold:     contracts.HoldInterrupted,
		}, nil
	}
	if driver.waitUntil(driver.runtime.Limits.ReadyWait(), driver.screenDecided); !driver.promptReady() {
		return driver.stagedBehindScreen(request)
	}

	generation := driver.runtime.Generation(driver.runtime.Composer)
	// The text goes in as one bracketed paste of its sanitized form, so a newline in a participant's body never
	// submits early and no control character reaches the program; only the gate's own Enter submits.
	line, err := driver.runtime.Gate.Paste(request.RequestID, request.Attempt, sanitizedText(text), generation)
	if errors.Is(err, terminal.ErrComposerHeld) {
		return staged(request), nil
	}
	if err != nil {
		return failed(request), err
	}

	// The program has read the paste once it drew it; the Enter then follows as a key of its own, after the screen
	// had a moment to go still, never in the same read as the paste.
	if driver.waitUntil(driver.runtime.Limits.EchoWait(), func() bool { return driver.runtime.Gate.Shows(line) }) {
		driver.runtime.Clock.Sleep(echoQuiet)
	}
	entered := driver.runtime.Generation(driver.runtime.Composer)
	delivery, err := driver.runtime.Gate.Submit(line, 0)
	if errors.Is(err, terminal.ErrLineStranded) {
		return driver.strandedResult(request, line), nil
	}
	if err != nil || delivery != terminal.Delivered || !driver.tookLine(entered) {
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressDeliveryUncertain}, err
	}

	driver.mutex.Lock()
	driver.turns++
	driver.turnEnd = &turnEnd{ended: make(chan contracts.TurnEnd, 1)}
	driver.mutex.Unlock()

	return contracts.OperationResult{Request: request, Progress: contracts.ProgressApplying}, nil
}

// tookLine is whether the program took the entered line: its composer changed after the Enter. A composer that
// stays exactly as it was when Enter was pressed still holds the line, so it gets Enter again as many times as the
// journal's limits allow; a user or a browser writer who holds the input by then ends it.
func (driver *TerminalDriver) tookLine(entered uint64) bool {
	changed := func() bool { return driver.runtime.Generation(driver.runtime.Composer) != entered }

	for again := 0; again < driver.runtime.Limits.UnsentEnters; again++ {
		if driver.waitUntil(driver.runtime.Limits.UnsentLook(), changed) {
			return true
		}
		if err := driver.runtime.Gate.Keys(enterKey); err != nil {
			return false
		}
	}

	return driver.waitUntil(driver.runtime.Limits.UnsentLook(), changed)
}

// strandedResult is how a line a browser take stranded ended: cancelled before submit only on the take's proven
// settlement, otherwise uncertain, never replayed.
func (driver *TerminalDriver) strandedResult(
	request contracts.RequestIdentity,
	line *terminal.TypedLine,
) contracts.OperationResult {
	if driver.runtime.Gate.Settlement(line, driver.runtime.Limits.StrandedSettle()) {
		return contracts.OperationResult{Request: request, Progress: contracts.ProgressCancelled}
	}

	return contracts.OperationResult{Request: request, Progress: contracts.ProgressDeliveryUncertain}
}

// awaitTurnEnd waits for the turn to take the composer away and then for an empty, still composer again, and tells
// whether the composer left within the journal's start window.
func (driver *TerminalDriver) awaitTurnEnd(current *turnEnd) {
	left := driver.waitUntil(driver.runtime.Limits.TurnStartWindow(), func() bool { return !driver.promptReady() })
	for !driver.promptReady() {
		driver.runtime.Clock.Sleep(pollInterval)
	}
	driver.mutex.Lock()
	current.seen = true
	driver.mutex.Unlock()
	current.ended <- contracts.TurnEnd{ComposerLeft: &left}
}

// stagedBehindScreen is a prompt the screen did not let in: it stays staged and is held by what the screen shows, a
// menu's own reason or an unknown screen, so the journal says what waits for a user instead of nothing. A menu with a
// recorded Later is answered with it, as for any hold. A screen with nothing on it yet, or one still being drawn, is
// a program that is starting and holds nothing.
func (driver *TerminalDriver) stagedBehindScreen(request contracts.RequestIdentity) (contracts.OperationResult, error) {
	reading := driver.runtime.Classifier.Classify(driver.runtime.Clock.Now())
	snapshot := driver.runtime.Classifier.Snapshot()
	log.Printf("request %s waits behind the screen: %s, menu %q, stable %t, on the %s buffer with the cursor at %+v",
		request.RequestID, reading.Kind, reading.Menu, reading.Stable, snapshot.Buffer, snapshot.Cursor)
	if reading.Kind == screen.Unknown && (!reading.Stable || screen.IsBlank(driver.runtime.Classifier.Snapshot())) {
		return staged(request), nil
	}
	holds := terminal.NewHolds(driver.runtime.Layout, "", driver.runtime.Gate)
	report, err := holds.Observe(reading, request.RequestID, 0)
	if err != nil {
		return failed(request), err
	}

	result := staged(request)
	result.Hold = contracts.Hold(report.Reason)

	return result, nil
}

// screenDecided is whether the screen says what a prompt meets: a ready composer, or a known menu holding still,
// which is handled the moment it is read instead of at the end of the wait.
func (driver *TerminalDriver) screenDecided() bool {
	reading := driver.runtime.Classifier.Classify(driver.runtime.Clock.Now())

	return reading.Stable && (reading.Kind == screen.PromptReady || reading.Kind == screen.MenuShown)
}

func (driver *TerminalDriver) promptReady() bool {
	reading := driver.runtime.Classifier.Classify(driver.runtime.Clock.Now())

	return reading.Kind == screen.PromptReady && reading.Stable
}

// waitUntil reads the condition on the runtime's clock until it holds or the deadline passes.
func (driver *TerminalDriver) waitUntil(deadline time.Duration, condition func() bool) bool {
	until := driver.runtime.Clock.Now().Add(deadline)

	for !condition() {
		if !driver.runtime.Clock.Now().Before(until) {
			return false
		}
		driver.runtime.Clock.Sleep(pollInterval)
	}

	return true
}

// bindingRefusal says why a queued attempt does not match the script the host would run, before any key is sent: another
// reviewed version, other parameters than the script names, or a resume step the script does not have.
func bindingRefusal(script keyscripts.KeyScript, request contracts.KeyScriptRequest) error {
	if request.Version != script.Version {
		return fmt.Errorf("key script %s is at version %d here, not the version %d the journal reviewed",
			script.Name, script.Version, request.Version)
	}
	for name := range request.Parameters {
		if !slices.Contains(script.Parameters, name) {
			return fmt.Errorf("key script %s has no parameter %s", script.Name, name)
		}
	}
	if request.ResumeStep != nil && (*request.ResumeStep < 0 || *request.ResumeStep >= len(script.Steps)) {
		return fmt.Errorf("key script %s has no step %d to resume from", script.Name, *request.ResumeStep)
	}

	return nil
}

func failed(request contracts.RequestIdentity) contracts.OperationResult {
	return contracts.OperationResult{Request: request, Progress: contracts.ProgressFailed}
}
