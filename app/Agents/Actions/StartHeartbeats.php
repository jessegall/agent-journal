<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\PresenceWindow;
use App\Agents\Contracts\StartHeartbeats as StartHeartbeatsContract;
use App\Agents\Enums\SessionStatus;
use App\Agents\Events\SessionClosed;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Support\DriverRequestEndings;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\StartTransaction;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

/**
 * Follows a start by its heartbeats. A session whose beats stop for a presence window is marked silent, which only
 * means absent: silence never times a session out. The host's verified report that the program exited ends it.
 */
final readonly class StartHeartbeats implements StartHeartbeatsContract
{
    public function __construct(
        private StartTransaction $transaction,
        private StartTokens $credentials,
        private PresenceWindow $window,
        private ServerClock $clock,
        private CommandFacts $facts,
        private DriverRequestEndings $endings,
    ) {}

    /**
     * Marks silent every active session whose last beat, or whose start when it never beat, is a presence window old.
     */
    public function markSilentStarts(): void
    {
        $now = $this->clock->now();

        $this->markSilentSince($now->subSeconds($this->window->presenceSeconds), $now);
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
