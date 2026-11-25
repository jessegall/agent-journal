<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Sessions\StartHeartbeats as StartHeartbeatsContract;
use App\Contracts\Sessions\StartTransaction;
use App\Contracts\Time\ServerClock;
use App\Enums\Agents\SessionProcessState;
use App\Enums\Sessions\SessionStatus;
use App\Events\Sessions\SessionClosed;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use Carbon\CarbonImmutable;

/**
 * Follows a start by its heartbeats. A session whose beats stop for a presence window is marked silent, which only
 * means absent: silence never times a session out. The host's verified report that the driver exited ends it, and
 * a session no host took up, that never beat and whose start nobody claimed within a presence window, ends too.
 */
final readonly class StartHeartbeats implements StartHeartbeatsContract
{
    /**
     * How many never-started sessions one sweep ends; the next sweep takes the rest.
     */
    private const int UNCLAIMED_ENDED_LIMIT = 50;

    /**
     * How long a start waits for a host whose calls fail or that stopped calling, before it ends.
     */
    private const int UNREACHABLE_HOST_WAIT_MINUTES = 30;

    /**
     * How long a session may stay silent while its host is still present before the journal ends it as unserved.
     */
    private const int UNSERVED_SECONDS = 600;

    /**
     * How many unserved sessions one sweep ends; the next sweep takes the rest.
     */
    private const int UNSERVED_ENDED_LIMIT = 50;

    public function __construct(
        private StartTransaction $transaction,
        private SessionTokens $credentials,
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
        $this->endUnservedSince($now->subSeconds(self::UNSERVED_SECONDS), $cutoff);
    }

    /**
     * A start whose process the host proved ended, or never made: the start stops, a switch stopping on it stops, and
     * its session, while still open, ends as a reported exit ends it, so its runtime stops and the agent can start
     * again.
     */
    public function endStart(SessionProcess $start, AgentSession $session, string $evidence): void
    {
        $start->stopWithProof();
        $stoppingSwitch = DriverSwitch::findStoppingOf($start->session_id);

        if ($stoppingSwitch !== null) {
            $stoppingSwitch->markStopped();
        }

        if ($session->isActive()) {
            $this->markExited($session, $evidence);
        }
    }

    /**
     * The host saw the driver exit, so the session ends at once with that evidence.
     */
    public function markExited(AgentSession $session, string $evidence): void
    {
        $this->endSession($session, "host reported exit: {$evidence}");
    }

    /**
     * Ends the session with its evidence: its credentials are revoked, its runtime closes and the agent can start
     * again.
     */
    private function endSession(AgentSession $session, string $evidence): void
    {
        $this->transaction->runForSession($session->id, function () use ($session, $evidence): void {
            $session->endWithEvidenceAt(CarbonImmutable::now(), $evidence);
            $this->credentials->revoke($session);

            AgentRuntime::query()
                ->ofAgentSession($session->id)
                ->lockForUpdate()
                ->limit(1)
                ->get()
                ->each(fn (AgentRuntime $runtime) => $this->endings->closeAfterExit($runtime));

            $this->facts->publishAfterCommit(new SessionClosed($session->agent_id, $session->id));
            $this->facts->runTransactionListeners();
        });
    }

    /**
     * Ends each running session that never beat and whose start is still waiting for a host since the cutoff, so the
     * agent can start again and its reserved capacity is freed. A start whose host cannot be reached, its calls failing
     * or stopped, waits for it to come back instead, up to half an hour; so does a start no host was chosen for yet
     * while no enrolled host can be reached.
     */
    private function endUnclaimedSince(CarbonImmutable $cutoff, CarbonImmutable $now): void
    {
        $unreachableHosts = Host::query()->unreachableSince($cutoff)->keys();
        $isAnyHostReachable = Host::query()->unrevoked()->excludingKeys($unreachableHosts)->exists();

        SessionProcess::query()->supervised()
            ->unclaimedTooLong(
                $now->subMinutes(self::UNREACHABLE_HOST_WAIT_MINUTES),
                $cutoff,
                $unreachableHosts,
                $isAnyHostReachable,
            )
            ->limit(self::UNCLAIMED_ENDED_LIMIT)
            ->get()
            ->each(fn (SessionProcess $start) => $this->endUnclaimed($start->session_id, $now));
    }

    /**
     * Ends each session silent since the cutoff whose host still beats for another session within the presence
     * window: the host is there but no longer serves this one, so it never comes back by itself.
     */
    private function endUnservedSince(CarbonImmutable $cutoff, CarbonImmutable $presenceCutoff): void
    {
        $liveHosts = AgentRuntime::query()
            ->ofSessions(AgentSession::query()->beatAfter($presenceCutoff)->keys())
            ->hostIds();

        AgentSession::query()
            ->withStatus(SessionStatus::Silent)
            ->silentSince($cutoff)
            ->withAnyId(AgentRuntime::query()->ofHosts($liveHosts)->sessionIds())
            ->limit(self::UNSERVED_ENDED_LIMIT)
            ->get()
            ->each(fn (AgentSession $session) => $this->endSession(
                $session,
                'its host is present but sent no heartbeat for it, so nothing serves it any more',
            ));
    }

    private function endUnclaimed(string $sessionId, CarbonImmutable $now): void
    {
        $this->transaction->runForSession($sessionId, function () use ($sessionId, $now): void {
            $start = SessionProcess::findLockedCurrentOf($sessionId);

            if ($start === null || $start->state !== SessionProcessState::Pending) {
                return;
            }

            $session = AgentSession::query()->findOrFail($sessionId);
            $session->endWithEvidenceAt($now, 'no host took up its start within the presence window');
            $start->cancelPending();
            $this->capacity->releaseFor($session->start_request_id);
            $this->credentials->revoke($session);

            AgentRuntime::query()
                ->ofAgentSession($session->id)
                ->lockForUpdate()
                ->limit(1)
                ->get()
                ->each(fn (AgentRuntime $runtime) => $this->endings->closeAfterExit($runtime));

            $this->facts->publishAfterCommit(new SessionClosed($session->agent_id, $session->id));
            $this->facts->runTransactionListeners();
        });
    }

    /**
     * Marks every running session that has shown no life since the cutoff as silent, in one update.
     */
    private function markSilentSince(CarbonImmutable $cutoff, CarbonImmutable $now): void
    {
        AgentSession::query()->withStatus(SessionStatus::Active)
            ->showedNoLifeSince($cutoff)
            ->update([
                'status' => SessionStatus::Silent->value,
                'silent_since' => $now,
            ]);
    }
}
