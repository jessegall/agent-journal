<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Data\TerminalFrameData;
use App\Agents\Enums\TerminalFrameState;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\TerminalView;
use Carbon\CarbonImmutable;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Opens, renews and closes a viewer's lease on an agent's terminal, with the refusals an open meets, and answers the
 * frames the viewer should see.
 */
final readonly class TerminalViews
{
    public function __construct(private RuntimeScreen $screens) {}

    /**
     * Opens a new view of the agent's current runtime for the viewer.
     *
     * @throws TerminalViewRefused
     */
    public function open(
        string $agentId,
        ActorIdentity $viewer,
        int $intervalMs,
        CarbonImmutable $now,
    ): TerminalViewReceipt {
        if (! in_array($intervalMs, TerminalView::INTERVALS_MS, true)) {
            throw TerminalViewRefused::interval($intervalMs);
        }

        $runtime = $this->watchableRuntime($agentId);
        if (TerminalView::query()->ownedBy($viewer)->live()->count() >= TerminalView::MAX_PER_VIEWER) {
            throw TerminalViewRefused::tooManyViews();
        }

        return $this->receiptOf(TerminalView::open($viewer, $runtime, $intervalMs, $now));
    }

    /**
     * Keeps the viewer's live view of the runtime live for another lease, or opens a new one when it lapsed or ended.
     *
     * @throws TerminalViewRefused
     */
    public function renew(
        string $agentId,
        ActorIdentity $viewer,
        int $intervalMs,
        CarbonImmutable $now,
    ): TerminalViewReceipt {
        $runtime = $this->watchableRuntime($agentId);
        $view = TerminalView::query()->ownedBy($viewer)->live()->where('agent_runtime_id', $runtime->id)->first();
        if ($view === null) {
            return $this->open($agentId, $viewer, $intervalMs, $now);
        }

        $view->renew($now);

        return $this->receiptOf($view);
    }

    /**
     * Ends the viewer's live views of the runtime at once; other viewers' views stay.
     */
    public function close(string $agentId, ActorIdentity $viewer, CarbonImmutable $now): void
    {
        $runtime = $this->runtimeOf($agentId);
        $views = TerminalView::query()->ownedBy($viewer)->live()->where('agent_runtime_id', $runtime->id)->get();
        foreach ($views as $view) {
            $view->close($now);
        }
    }

    /**
     * The frame the viewer should see next: none while nothing newer than the epoch and sequence they hold is kept,
     * the last frame once the terminal ended, and once a restarted answer when the agent moved to another runtime or
     * generation, which the view then follows.
     *
     * @return Option<TerminalFrameData>
     *
     * @throws TerminalViewRefused
     */
    public function frame(
        string $agentId,
        ActorIdentity $viewer,
        string $epoch,
        int $after,
        CarbonImmutable $now,
    ): Option
    {
        $view = TerminalView::query()->ownedBy($viewer)->live()->ofAgent($agentId)->latest('updated_at')->first();
        if ($view === null) {
            return Some::create($this->endedView($agentId, $viewer, $now));
        }

        $runtime = $this->runtimeOf($agentId);
        if (! $view->watches($runtime)) {
            $view->follow($runtime);

            return Some::create(TerminalFrameData::from(['state' => TerminalFrameState::Restarted]));
        }

        $received = $this->screens->latest($runtime->id);
        if ($runtime->hasEnded()) {
            return Some::create($this->ended($received, $runtime->updated_at->toImmutable()));
        }

        if ($received === null || ! $received->isNewerThan($epoch, $after)) {
            return None::create();
        }

        return Some::create(TerminalFrameData::from([
            'state' => TerminalFrameState::Live,
            'frame' => $received->frame,
            'receivedAt' => $received->receivedAt,
        ]));
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
     * The answer for a viewer whose view of the agent ended: the last frame of the runtime it watched while kept.
     */
    private function endedView(string $agentId, ActorIdentity $viewer, CarbonImmutable $now): TerminalFrameData
    {
        $last = TerminalView::query()->ownedBy($viewer)->ofAgent($agentId)->latest('closed_at')->first();
        if ($last === null) {
            return TerminalFrameData::from(['state' => TerminalFrameState::Ended, 'endedAt' => $now]);
        }

        return $this->ended($this->screens->latest($last->agent_runtime_id), $last->closed_at ?? $now);
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

    private function receiptOf(TerminalView $view): TerminalViewReceipt
    {
        return new TerminalViewReceipt(
            $view->id,
            $view->agent_runtime_id,
            $view->interval_ms,
            TerminalView::LEASE_SECONDS,
        );
    }
}
