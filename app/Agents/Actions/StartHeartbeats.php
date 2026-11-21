<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\PresenceWindow;
use App\Agents\Contracts\StartHeartbeats as StartHeartbeatsContract;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Enums\SessionStatus;
use App\Agents\Events\SessionClosed;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\CapacityRelease;
use App\Agents\Support\DriverRequestEndings;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\StartTransaction;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

/**
 * Follows a start by its heartbeats. A session whose beats stop for a presence window is marked silent, which only
 * means absent: silence never times a session out. The host's verified report that the program exited ends it, and
 * a session no host took up, that never beat and whose start nobody claimed within a presence window, ends too.
 */
final readonly class StartHeartbeats implements StartHeartbeatsContract
{
    /**
     * How many never-started sessions one sweep ends; the next sweep takes the rest.
     */
    private const int UNCLAIMED_ENDED_PER_SWEEP = 50;

    public function __construct(
        private StartTransaction $transaction,
        private StartTokens $credentials,
        private PresenceWindow $window,
        private ServerClock $clock,
        private CommandFacts $facts,
        private DriverRequestEndings $endings,
        private CapacityRelease $capacity,
    ) {}

    /**
     * Marks silent every active session whose last beat, or whose start when it never beat, is a presence window old.
     */
    public function markSilentStarts(): void
    {
        $now = $this->clock->now();
        $cutoff = $now->subSeconds($this->window->presenceSeconds);

        $this->markSilentSince($cutoff, $now);
        $this->endUnclaimedSince($cutoff, $now);
    }

    /**
     * The host saw the program exit, so the session ends at once with that evidence.
     */
    public function markExited(AgentSession $session, string $evidence): void
    {
        $this->transaction->runForSession($session->id, function () use ($session, $evidence): void {
            $session->endWithEvidenceAt(CarbonImmutable::now(), "host reported exit: {$evidence}");
            $this->credentials->revoke($session);
            AgentRuntime::query()
                ->where('agent_session_id', $session->id)
                ->lockForUpdate()
                ->limit(1)
                ->get()
                ->each(fn (AgentRuntime $runtime) => $this->endings->closeAfterExit($runtime));

            $this->facts->publishAfterCommit(new SessionClosed($session->agent_id, $session->id));
            $this->facts->applyRequired();
        });
    }

    /**
     * Ends each running session that never beat and whose start is still waiting for a host since the cutoff, so the
     * agent can start again and its reserved capacity is freed.
     */
    private function endUnclaimedSince(CarbonImmutable $cutoff, CarbonImmutable $now): void
    {
        ProcessStart::supervised()
            ->where('state', ProcessStartState::Pending->value)
            ->where('created_at', '<=', $cutoff)
            ->whereIn('session_id', AgentSession::query()
                ->whereIn('status', array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()))
                ->whereNull('last_heartbeat_at')
                ->select('id'))
            ->limit(self::UNCLAIMED_ENDED_PER_SWEEP)
            ->get()
            ->each(fn (ProcessStart $start) => $this->endUnclaimed($start->session_id, $now));
    }

    private function endUnclaimed(string $sessionId, CarbonImmutable $now): void
    {
        $this->transaction->runForSession($sessionId, function () use ($sessionId, $now): void {
            $start = ProcessStart::lockedCurrentOf($sessionId);

            if ($start === null || $start->state !== ProcessStartState::Pending) {
                return;
            }

            $session = AgentSession::query()->findOrFail($sessionId);
            $session->endWithEvidenceAt($now, 'no host took up its start within the presence window');
            $start->cancelPending();
            $this->capacity->releaseFor($session->start_request_id);
            $this->credentials->revoke($session);
            AgentRuntime::query()
                ->where('agent_session_id', $session->id)
                ->lockForUpdate()
                ->limit(1)
                ->get()
                ->each(fn (AgentRuntime $runtime) => $this->endings->closeAfterExit($runtime));

            $this->facts->publishAfterCommit(new SessionClosed($session->agent_id, $session->id));
            $this->facts->applyRequired();
        });
    }

    /**
     * Marks every running session that has shown no life since the cutoff as silent, in one update.
     */
    private function markSilentSince(CarbonImmutable $cutoff, CarbonImmutable $now): void
    {
        AgentSession::query()->where('status', SessionStatus::Active->value)
            ->where(fn (Builder $silent) => $silent->where('last_heartbeat_at', '<=', $cutoff)
                ->orWhere(fn (Builder $neverBeat) => $neverBeat
                    ->whereNull('last_heartbeat_at')
                    ->where('created_at', '<=', $cutoff)))
            ->update(['status' => SessionStatus::Silent->value, 'silent_since' => $now]);
    }
}
