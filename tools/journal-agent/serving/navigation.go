package serving

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	"journal-agent/client"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/keyscripts"
)

const raiseAttempts = 3

// navigation carries a stalled request, its last screen and its replay history while the runtime is held.
type navigation struct {
	loop        *Loop
	runtime     *liveRuntime
	request     client.ClaimedRequest
	uncertainty keyscripts.Uncertainty
	rereader    screenRereader
	declined    []string
	sent        []string
	ask         int
}

type screenRereader interface {
	Reread(stalled keyscripts.Uncertainty) (keyscripts.Uncertainty, bool)
}

type entryReplayer interface {
	ReplayEntry(entry keyscripts.Entry) (keyscripts.ReplayResult, error)
}

func newNavigation(
	loop *Loop,
	runtime *liveRuntime,
	request client.ClaimedRequest,
	uncertainty keyscripts.Uncertainty,
) navigation {
	rereader, _ := runtime.driver.(screenRereader)
	return navigation{loop: loop, runtime: runtime, request: request, uncertainty: uncertainty, rereader: rereader}
}

// raise resends a lost raise only with a fresh screen. The runtime stays held when no answer can be obtained.
func (nav navigation) raise(ctx context.Context) {
	nav.loop.holdRuntime(nav.runtime)
	for attempt := 1; ; attempt++ {
		answer, err := nav.loop.journal.RaiseNavigation(ctx, nav.runtime.id, nav.raisePayload())
		if err == nil {
			nav.answer(ctx, answer)
			return
		}
		if errors.Is(err, client.ErrRefused) {
			log.Printf("the raise of request %s was refused: %v", nav.request.RequestID, err)
			nav.end(ctx)
			return
		}
		if attempt == raiseAttempts || nav.rereader == nil {
			log.Printf("the raise of request %s got no answer; the runtime stays held: %v", nav.request.RequestID, err)
			return
		}
		if !waitForNavigation(ctx, nav.loop.raiseRetryDelay) {
			return
		}
		fresh, readable := nav.reread()
		if !readable {
			return
		}
		nav.uncertainty = fresh
	}
}

func (nav navigation) answer(ctx context.Context, answer client.NavigationAnswer) {
	switch answer.Answer {
	case client.NavigationEntry:
		nav.replayEntry(ctx, answer)
	case client.NavigationOpened:
		nav.notifyStop(ctx, contracts.ProgressApplying, nil)
	case client.NavigationWait:
		go nav.askAgainAfter(ctx, waitOf(answer))
	default:
		nav.end(ctx)
	}
}

func (nav navigation) replayEntry(ctx context.Context, answer client.NavigationAnswer) {
	var entry keyscripts.Entry
	replayer, replays := nav.runtime.driver.(entryReplayer)
	if err := json.Unmarshal(answer.Entry, &entry); err != nil || !replays {
		nav.end(ctx)
		return
	}

	result, err := replayer.ReplayEntry(entry)
	if err == nil && !answer.IsGuarded && isStale(result) {
		nav.notifyStale(ctx, entry, result)
		next := nav.declining(entry.ID)
		next.uncertainty = staleUncertainty(nav.uncertainty, result, entry.ID)
		next.sent = sentSteps(entry, result.Step)
		next.raise(ctx)
		return
	}
	if err != nil || result.Outcome != keyscripts.Proven {
		nav.declining(entry.ID).raise(ctx)
		return
	}

	nav.completeReplay(ctx, entry.ID, result)
}

func (nav navigation) completeReplay(ctx context.Context, entryID string, result keyscripts.ReplayResult) {
	request := nav.request
	key := fmt.Sprintf("%s:%d:replay:%s", request.RequestID, request.Attempt, entryID)
	if err := nav.loop.journal.NotifyReplayed(ctx, entryID, nav.runtime.id, key); err != nil {
		log.Printf("the replay of entry %s could not be reported: %v", entryID, err)
	}
	nav.loop.releaseRuntime(nav.runtime)
	if result.ResumeAt != nil {
		request.ScriptStep = result.ResumeAt
		nav.loop.settleScript(ctx, nav.runtime, request)
		return
	}

	nav.loop.notify(ctx, request, contracts.OperationResult{
		Progress: contracts.ProgressApplied,
		Outcome:  contracts.OutcomeConfirmed,
	})
}

func (nav navigation) declining(entryID string) navigation {
	nav.declined = append(append([]string{}, nav.declined...), entryID)
	nav.sent = nil
	nav.ask = 0

	return nav
}

// isStale is a replay that matched its first step and then failed a check, or whose proof never showed: the entry no
// longer fits this build. A failure at the first step is not stale, since two menus can share a fingerprint.
func isStale(result keyscripts.ReplayResult) bool {
	return result.Outcome == keyscripts.Stale && (result.Step > 0 || result.Reason == keyscripts.NoProof)
}

// notifyStale marks the entry stale on the runtime's build, with the step and reason it failed at and the redacted
// screen it failed on, under a key of the replay so a repeated report is the same one.
func (nav navigation) notifyStale(ctx context.Context, entry keyscripts.Entry, result keyscripts.ReplayResult) {
	request := nav.request
	runtime := nav.runtime
	report := client.EntryStaleReport{
		RuntimeID:    runtime.id,
		OperationKey: fmt.Sprintf("%s:%d:stale:%s", request.RequestID, request.Attempt, entry.ID),
		Reason:       string(result.Reason),
		Step:         result.Step,
		Build:        runtime.build,
		Rows:         []string{},
	}
	if result.Uncertainty != nil {
		report.Rows = result.Uncertainty.Rows
	}
	if err := nav.loop.journal.NotifyStale(ctx, entry.ID, report); err != nil {
		log.Printf("the stale replay of entry %s could not be reported: %v", entry.ID, err)
	}
}

// staleUncertainty is the stalled script's raise on the screen the stale replay stopped on, named stale-entry with
// the entry it replaces.
func staleUncertainty(
	stalled keyscripts.Uncertainty,
	result keyscripts.ReplayResult,
	entryID string,
) keyscripts.Uncertainty {
	stale := stalled
	if live := result.Uncertainty; live != nil {
		stale.Fingerprint = live.Fingerprint
		stale.Rows = live.Rows
		stale.Highlight = live.Highlight
		stale.Generation = live.Generation
		stale.Epoch = live.Epoch
		stale.HostRows = live.HostRows
	}
	stale.Reason = keyscripts.StaleEntry
	stale.StaleEntry = entryID

	return stale
}

// sentSteps names the entry's steps the replay sent before the one it failed at: a key by its name, a chosen entry
// only as a choice, since its label is screen text.
func sentSteps(entry keyscripts.Entry, failedAt int) []string {
	sent := []string{}
	for index := 0; index < failedAt && index < len(entry.Steps); index++ {
		if key := entry.Steps[index].Key; key != nil {
			sent = append(sent, fmt.Sprintf("step %d: key %s", index+1, *key))
			continue
		}
		sent = append(sent, fmt.Sprintf("step %d: choose", index+1))
	}

	return sent
}

// askAgainAfter asks under a new key after the journal's wait, while this navigation still holds the runtime.
func (nav navigation) askAgainAfter(ctx context.Context, wait time.Duration) {
	if !waitForNavigation(ctx, wait) || !nav.loop.heldForNavigation(nav.runtime) {
		return
	}
	fresh, readable := nav.reread()
	if !readable {
		return
	}

	nav.uncertainty = fresh
	nav.ask++
	nav.raise(ctx)
}

func waitForNavigation(ctx context.Context, delay time.Duration) bool {
	timer := time.NewTimer(delay)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return false
	case <-timer.C:
		return ctx.Err() == nil
	}
}

// reread keeps the last screen when the driver has no screen reader.
func (nav navigation) reread() (keyscripts.Uncertainty, bool) {
	if nav.rereader == nil {
		return nav.uncertainty, true
	}
	fresh, readable := nav.rereader.Reread(nav.uncertainty)
	if !readable {
		log.Printf("the screen of request %s may no longer leave the host; the runtime stays held", nav.request.RequestID)
	}

	return fresh, readable
}

func (nav navigation) raisePayload() client.NavigationRaise {
	request := nav.request
	uncertainty := nav.uncertainty
	key := fmt.Sprintf("%s:%d:%d", request.RequestID, request.Attempt, uncertainty.Step)
	if nav.ask > 0 {
		key = fmt.Sprintf("%s:ask:%d", key, nav.ask)
	}

	return client.NavigationRaise{
		OperationKey:    key,
		RequestID:       request.RequestID,
		Attempt:         request.Attempt,
		Step:            uncertainty.Step,
		Reason:          string(uncertainty.Reason),
		Fingerprint:     uncertainty.Fingerprint,
		Rows:            uncertainty.Rows,
		Highlight:       uncertainty.Highlight,
		Generation:      uncertainty.Generation,
		StaleEntry:      uncertainty.StaleEntry,
		DeclinedEntries: nav.declined,
		SentSteps:       nav.sent,
	}
}

func (nav navigation) end(ctx context.Context) {
	outcome := string(contracts.OutcomeEntryUnavailable)
	nav.notifyStop(ctx, contracts.ProgressFailed, &outcome)
	nav.loop.holdRuntime(nav.runtime)
}

// notifyStop shares only the stalled step and its reason.
func (nav navigation) notifyStop(ctx context.Context, progress contracts.Progress, outcome *string) {
	report := client.RequestReport{
		RequestID: nav.request.RequestID,
		Attempt:   nav.request.Attempt,
		Progress:  string(progress),
		Outcome:   outcome,
		Script: &client.ScriptReport{
			Step:       nav.uncertainty.Step,
			Generation: nav.runtime.driver.Generation(),
			Evidence:   "navigation-needed: " + string(nav.uncertainty.Reason),
		},
	}
	if err := nav.loop.journal.NotifyRequest(ctx, report); err != nil {
		log.Printf("the stop of request %s for navigation could not be reported: %v", nav.request.RequestID, err)
	}
}

// heldForNavigation is whether the runtime is still open on this host and held for its navigation.
func (loop *Loop) heldForNavigation(runtime *liveRuntime) bool {
	loop.mutex.Lock()
	defer loop.mutex.Unlock()

	return loop.runtimes[runtime.id] == runtime && runtime.hold == contracts.HoldNavigationNeeded
}

// waitOf is how long the journal asked the host to wait before it asks again, five seconds when it named no time.
func waitOf(answer client.NavigationAnswer) time.Duration {
	if answer.RetryAfterSeconds == nil {
		return 5 * time.Second
	}

	return time.Duration(*answer.RetryAfterSeconds) * time.Second
}

// releaseRuntime ends the runtime's navigation hold, so its queue runs again.
func (loop *Loop) releaseRuntime(runtime *liveRuntime) {
	loop.mutex.Lock()
	runtime.hold = contracts.HoldNone
	loop.mutex.Unlock()
	loop.scheduler.With(runtime.id, func(queue *host.RuntimeQueue) { queue.Release() })
}

// holdRuntime holds the runtime navigation_needed, so no other work types into the menu its script stopped on.
func (loop *Loop) holdRuntime(runtime *liveRuntime) {
	loop.mutex.Lock()
	runtime.hold = contracts.HoldNavigationNeeded
	loop.mutex.Unlock()
	loop.scheduler.With(runtime.id, func(queue *host.RuntimeQueue) { queue.Hold() })
}
