<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Navigation\TerminalViewCloser as TerminalViewCloserContract;
use App\Data\Terminals\TerminalFrameData;
use App\Data\Terminals\TerminalInterestData;
use App\Data\Terminals\TerminalScreenIdentityData;
use App\Enums\Terminals\TerminalFrameStatus;
use App\Exceptions\TerminalViewRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalView;
use Carbon\CarbonImmutable;

/**
 * Opens, renews and closes a viewer's read interests in an agent's terminal, one per explicit open and each addressed
 * by its own id, with the refusals they meet, and answers the frames each interest should see.
 */
final readonly class TerminalViewCloser implements TerminalViewCloserContract
{
    public function __construct(
        private RuntimeScreen $screens,
        private CurrentRuntimes $runtimes,
        private TerminalControls $controls,
    ) {}

    /**
     * Opens a new read interest in the agent's current runtime for the viewer; a retry of the same open request gives
     * the interest it opened first, as it stands now, closed or lapsed included.
     *
     * @throws TerminalViewRefused
     */
    public function open(
        string $agentId,
        ActorReference $viewer,
        int $intervalMs,
        string $requestId,
        CarbonImmutable $now,
    ): string {
        $opened = TerminalView::query()->ownedBy($viewer)->ofAgent($agentId)->openedBy($requestId)->first();

        if ($opened !== null) {
            return $opened->id;
        }

        if (! in_array($intervalMs, TerminalView::INTERVALS_MS, true)) {
            throw TerminalViewRefused::unsupportedInterval($intervalMs);
        }

        $runtime = $this->watchableRuntime($agentId);

        if (TerminalView::query()->ownedBy($viewer)->live()->count() >= TerminalView::MAX_PER_VIEWER) {
            throw TerminalViewRefused::tooManyViews();
        }

        $view = TerminalView::create($viewer, $runtime, $intervalMs, $now, $requestId);

        return $view->id;
    }

    /**
     * Keeps exactly the viewer's read interest live for another lease; an interest that was closed or lapsed is
     * refused and never reopens, and a renewal never grants anything but reading.
     *
     * @throws TerminalViewRefused
     */
    public function renew(
        string $agentId,
        ActorReference $viewer,
        string $readInterestId,
        CarbonImmutable $now,
    ): string {
        $this->watchableRuntime($agentId);
        $view = $this->interestOf($agentId, $viewer, $readInterestId);

        if ($view->hasEndedAt($now)) {
            throw TerminalViewRefused::interestEnded();
        }

        $view->renew($now);

        return $view->id;
    }

    /**
     * Ends exactly the viewer's read interest; the viewer's other interests and other viewers' stay, and closing an
     * interest that already ended changes nothing.
     *
     * @throws TerminalViewRefused
     */
    public function close(string $agentId, ActorReference $viewer, string $readInterestId, CarbonImmutable $now): void
    {
        $this->runtimes->of($agentId);
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
        ActorReference $viewer,
        HeldFrame $held,
        CarbonImmutable $now,
    ): TerminalFrameData {
        $view = $this->interestOf($agentId, $viewer, $held->readInterestId);

        if (! $view->isLive()) {
            return $this->endedView($view, $now);
        }

        $runtime = $this->runtimes->of($agentId);

        if ($view->hasWatchedAnotherSession($runtime)) {
            $view->close($now);

            return $this->endedView($view, $now);
        }

        if (! $view->watches($runtime)) {
            $view->close($now);

            return TerminalFrameData::from(['state' => TerminalFrameStatus::Restarted]);
        }

        $received = $this->screens->latest(ScreenRegistration::of($runtime));

        if ($runtime->hasEnded()) {
            return $this->ended($received, $runtime->updated_at->toImmutable());
        }

        if ($received === null) {
            return TerminalFrameData::from(['state' => TerminalFrameStatus::Unchanged]);
        }

        return $this->answerOf($runtime, $received, $held, $now);
    }

    /**
     * Ends the viewer's live views of every runtime of the agent, as when the viewer may no longer inspect it.
     */
    public function closeAllFor(string $agentId, ActorReference $viewer, CarbonImmutable $now): void
    {
        $views = TerminalView::query()->ownedBy($viewer)->live()->ofAgent($agentId)->get();

        foreach ($views as $view) {
            $view->close($now);
        }

        $this->controls->revokeAllFor($agentId, $viewer, $now);
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
            'attachment' => $received->frame->attachment,
            'containerInstance' => $received->frame->containerInstance,
        ]);

        $liveForMs = $received->liveForMs($now);
        $proof = $liveForMs === null ? [] : ['liveForMs' => $liveForMs];

        if ($received->frame->isConnectionLost) {
            return TerminalFrameData::from([
                'state' => TerminalFrameStatus::ConnectionLost,
                'identity' => $identity,
                'receivedAt' => $received->receivedAt,
            ]);
        }

        if ($received->frame->isShielded) {
            return TerminalFrameData::from([
                'state' => TerminalFrameStatus::PreviewUnavailable,
                'identity' => $identity,
                'receivedAt' => $received->receivedAt,
                ...$proof,
            ]);
        }

        if (! $received->isNewerThan($held->epoch, $held->stream, $held->sequence)) {
            return TerminalFrameData::from([
                'state' => TerminalFrameStatus::Unchanged,
                'identity' => $identity,
                ...$proof,
            ]);
        }

        return TerminalFrameData::from([
            'state' => $liveForMs === null ? TerminalFrameStatus::LastReported : TerminalFrameStatus::Live,
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
            return TerminalFrameData::from([
                'state' => TerminalFrameStatus::Ended,
                'endedAt' => $endedAt,
            ]);
        }

        return TerminalFrameData::from([
            'state' => TerminalFrameStatus::Ended,
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
        $runtime = $this->runtimes->of($agentId);

        if (! $runtime->hasScreen()) {
            throw TerminalViewRefused::processDriver();
        }

        if ($runtime->hasEnded()) {
            throw TerminalViewRefused::notRunning($runtime->updated_at);
        }

        return $runtime;
    }

    /**
     * The viewer's read interest in the agent, live or ended; an id that is not the viewer's interest in this agent is
     * refused as unknown.
     *
     * @throws TerminalViewRefused
     */
    private function interestOf(string $agentId, ActorReference $viewer, string $readInterestId): TerminalView
    {
        $view = TerminalView::query()->withRuntime()->ownedBy($viewer)->ofAgent($agentId)
            ->withReadInterest($readInterestId)->first();

        if ($view === null) {
            throw TerminalViewRefused::unknownInterest();
        }

        return $view;
    }

    /**
     * The viewer's read interest as it stands now, as an open or renewal left it.
     */
    public function answerFor(ActorReference $viewer, string $viewId, CarbonImmutable $now): TerminalInterestData
    {
        $terminalView = TerminalView::query()->ownedBy($viewer)->whereKey($viewId)->sole();

        return $this->receiptOf($terminalView, $now);
    }

    private function receiptOf(TerminalView $view, CarbonImmutable $now): TerminalInterestData
    {
        return TerminalInterestData::from([
            'viewId' => $view->id,
            'readInterestId' => $view->read_interest_id,
            'runtimeId' => $view->agent_runtime_id,
            'intervalMs' => $view->interval_ms,
            'expiresInSeconds' => max(0, (int) ceil($now->diffInSeconds($view->expires_at, false))),
            'isLive' => ! $view->hasEndedAt($now),
        ]);
    }
}
