<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\TerminalViewCloser;
use App\Agents\Data\TerminalFrameData;
use App\Agents\Data\TerminalInterestData;
use App\Agents\Data\TerminalScreenIdentityData;
use App\Agents\Enums\TerminalFrameState;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\TerminalView;
use Carbon\CarbonImmutable;

/**
 * Opens, renews and closes a viewer's read interests in an agent's terminal, one per explicit open and each addressed
 * by its own id, with the refusals they meet, and answers the frames each interest should see.
 */
final readonly class TerminalViews implements TerminalViewCloser
{
    public function __construct(private RuntimeScreen $screens) {}

    /**
     * Opens a new read interest in the agent's current runtime for the viewer; a retry of the same open request gives
     * the interest it opened first, as it stands now, closed or lapsed included.
     *
     * @throws TerminalViewRefused
     */
    public function open(
        string $agentId,
        ActorIdentity $viewer,
        int $intervalMs,
        string $openRequestId,
        CarbonImmutable $now,
    ): TerminalInterestData {
        $opened = TerminalView::query()->ownedBy($viewer)->ofAgent($agentId)->openedBy($openRequestId)->first();

        if ($opened !== null) {
            return $this->receiptOf($opened, $now);
        }

        if (! in_array($intervalMs, TerminalView::INTERVALS_MS, true)) {
            throw TerminalViewRefused::unsupportedInterval($intervalMs);
        }

        $runtime = $this->watchableRuntime($agentId);

        if (TerminalView::query()->ownedBy($viewer)->live()->count() >= TerminalView::MAX_PER_VIEWER) {
            throw TerminalViewRefused::tooManyViews();
        }

        $view = TerminalView::create($viewer, $runtime, $intervalMs, $now, $openRequestId);

        return $this->receiptOf($view, $now);
    }

    /**
     * Keeps exactly the viewer's read interest live for another lease; an interest that was closed or lapsed is
     * refused and never reopens, and a renewal never grants anything but reading.
     *
     * @throws TerminalViewRefused
     */
    public function renew(
        string $agentId,
        ActorIdentity $viewer,
        string $readInterestId,
        CarbonImmutable $now,
    ): TerminalInterestData {
        $this->watchableRuntime($agentId);
        $view = $this->interestOf($agentId, $viewer, $readInterestId);

        if ($view->hasEndedAt($now)) {
            throw TerminalViewRefused::interestEnded();
        }

        $view->renew($now);

        return $this->receiptOf($view, $now);
    }

    /**
     * Ends exactly the viewer's read interest; the viewer's other interests and other viewers' stay, and closing an
     * interest that already ended changes nothing.
     *
     * @throws TerminalViewRefused
     */
    public function close(string $agentId, ActorIdentity $viewer, string $readInterestId, CarbonImmutable $now): void
    {
        $this->runtimeOf($agentId);
        $view = $this->interestOf($agentId, $viewer, $readInterestId);

        if (! $view->isLive()) {
            return;
        }

        $view->close($now);
    }

    /**
     * What the read interest should see next: unchanged while nothing newer than the stream and sequence it holds is
     * kept, the live frame with its proof's remaining lifetime, an older host's frame as last reported, no preview of a
     * shielded screen, the last frame once the terminal or the interest ended, and restarted, which ends the interest
     * and asks for a fresh open, once the same session runs in a new generation.
     *
     * @throws TerminalViewRefused
     */
    public function frame(
        string $agentId,
        ActorIdentity $viewer,
        HeldFrame $held,
        CarbonImmutable $now,
    ): TerminalFrameData {
        $view = $this->interestOf($agentId, $viewer, $held->readInterestId);

        if (! $view->isLive()) {
            return $this->endedView($view, $now);
        }

        $runtime = $this->runtimeOf($agentId);

        if ($view->watchedAnotherSession($runtime)) {
            $view->close($now);

            return $this->endedView($view, $now);
        }

        if (! $view->watches($runtime)) {
            $view->close($now);

            return TerminalFrameData::from(['state' => TerminalFrameState::Restarted]);
        }

        $received = $this->screens->latest(ScreenRegistration::of($runtime));

        if ($runtime->hasEnded()) {
            return $this->ended($received, $runtime->updated_at->toImmutable());
        }

        if ($received === null) {
            return TerminalFrameData::from(['state' => TerminalFrameState::Unchanged]);
        }

        return $this->answerOf($runtime, $received, $held, $now);
    }

    /**
     * The read interest the viewer opened that a request names, for a page that knows only its open request.
     *
     * @throws TerminalViewRefused
     */
    public function interestOpenedBy(string $agentId, ActorIdentity $viewer, string $openRequestId): string
    {
        $view = TerminalView::query()->ownedBy($viewer)->ofAgent($agentId)->openedBy($openRequestId)->first();

        if ($view === null) {
            throw TerminalViewRefused::unknownInterest();
        }

        return $view->read_interest_id;
    }

    /**
     * Ends the viewer's live views of every runtime of the agent, as when the viewer may no longer inspect it.
     */
    public function closeAllFor(string $agentId, ActorIdentity $viewer, CarbonImmutable $now): void
    {
        $views = TerminalView::query()->ownedBy($viewer)->live()->ofAgent($agentId)->get();

        foreach ($views as $view) {
            $view->close($now);
        }
    }

    /**
     * The answer about the runtime's kept screen for a view that holds the given frame.
     */
    private function answerOf(
        AgentRuntime $runtime,
        ReceivedScreen $received,
        HeldFrame $held,
        CarbonImmutable $now,
    ): TerminalFrameData {
        $identity = TerminalScreenIdentityData::from([
            'sessionId' => $runtime->agent_session_id,
            'processGeneration' => $received->identity->registration->processGeneration,
            'epoch' => $received->identity->epoch,
            'stream' => $received->identity->stream,
            'privacyRevision' => $received->identity->privacyRevision,
        ]);
        $liveForMs = $received->liveForMs($now);
        $proof = $liveForMs === null ? [] : ['liveForMs' => $liveForMs];

        if ($received->frame->shielded) {
            return TerminalFrameData::from([
                'state' => TerminalFrameState::PreviewUnavailable,
                'identity' => $identity,
                'receivedAt' => $received->receivedAt,
                ...$proof,
            ]);
        }

        if (! $received->isNewerThan($held->epoch, $held->stream, $held->sequence)) {
            return TerminalFrameData::from([
                'state' => TerminalFrameState::Unchanged,
                'identity' => $identity,
                ...$proof,
            ]);
        }

        return TerminalFrameData::from([
            'state' => $liveForMs === null ? TerminalFrameState::LastReported : TerminalFrameState::Live,
            'identity' => $identity,
            'frame' => $received->frame,
            'receivedAt' => $received->receivedAt,
            ...$proof,
        ]);
    }

    /**
     * The answer for a read interest that ended: the last frame of the runtime it watched while kept.
     */
    private function endedView(TerminalView $view, CarbonImmutable $now): TerminalFrameData
    {
        $received = $this->screens->latest(ScreenRegistration::of($view->runtime));

        return $this->ended($received, $view->closed_at ?? $now);
    }

    private function ended(ReceivedScreen|null $received, CarbonImmutable $endedAt): TerminalFrameData
    {
        if ($received === null) {
            return TerminalFrameData::from(['state' => TerminalFrameState::Ended, 'endedAt' => $endedAt]);
        }

        return TerminalFrameData::from([
            'state' => TerminalFrameState::Ended,
            'frame' => $received->frame,
            'receivedAt' => $received->receivedAt,
            'endedAt' => $endedAt,
        ]);
    }

    /**
     * The agent's current runtime, refused when it draws no screen or no longer runs.
     *
     * @throws TerminalViewRefused
     */
    private function watchableRuntime(string $agentId): AgentRuntime
    {
        $runtime = $this->runtimeOf($agentId);

        if (! $runtime->hasScreen()) {
            throw TerminalViewRefused::processDriver();
        }

        if ($runtime->hasEnded()) {
            throw TerminalViewRefused::notRunning($runtime->updated_at);
        }

        return $runtime;
    }

    /**
     * The agent's current runtime; an unknown agent and an agent with no runtime get the answer of no permission.
     *
     * @throws TerminalViewRefused
     */
    private function runtimeOf(string $agentId): AgentRuntime
    {
        $agent = Agent::query()->find($agentId);

        if ($agent === null || $agent->currentRuntime()->isEmpty()) {
            throw TerminalViewRefused::mayNotInspect();
        }

        $sessionId = $agent->currentRuntime()->get()->target->sessionId;

        return AgentRuntime::ofSession($sessionId) ?? throw TerminalViewRefused::mayNotInspect();
    }

    /**
     * The viewer's read interest in the agent, live or ended; an id that is not the viewer's interest in this agent is
     * refused as unknown.
     *
     * @throws TerminalViewRefused
     */
    private function interestOf(string $agentId, ActorIdentity $viewer, string $readInterestId): TerminalView
    {
        $view = TerminalView::query()->with('runtime')->ownedBy($viewer)->ofAgent($agentId)
            ->withReadInterest($readInterestId)->first();

        if ($view === null) {
            throw TerminalViewRefused::unknownInterest();
        }

        return $view;
    }

    private function receiptOf(TerminalView $view, CarbonImmutable $now): TerminalInterestData
    {
        return TerminalInterestData::from([
            'viewId' => $view->id,
            'readInterestId' => $view->read_interest_id,
            'runtimeId' => $view->agent_runtime_id,
            'intervalMs' => $view->interval_ms,
            'expiresInSeconds' => max(0, (int) $now->diffInSeconds($view->expires_at, false)),
            'live' => ! $view->hasEndedAt($now),
        ]);
    }
}
