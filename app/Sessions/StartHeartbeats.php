<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Actors\PresenceWindow;
use App\Agents\DriverRequestEndings;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Enums\SessionProcessStatus;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandRefusal;
use App\Events\Sessions\SessionClosed;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImageWait;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Contracts\StartHeartbeats as StartHeartbeatsContract;
use App\Sessions\Contracts\StartTransaction;
use App\Sessions\Enums\SessionStatus;
use App\Time\Contracts\ServerClock;
use Carbon\CarbonImmutable;
use Closure;

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
        private DriverCatalogue $drivers,
    ) {}

    /**
     * Marks silent every active session whose last beat, or whose start when it never beat, is a presence window old,
     * but for one the journal drives itself, which beats only while a turn runs.
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
     * Runs the start's next step; a refusal on the way, such as a build or a container that may not run, ends the start
     * with its reason instead of leaving it waiting.
     *
     * @param  Closure(): void  $step
     */
    public function continueStart(SessionProcess $start, Closure $step): void
    {
        try {
            $step();
        } catch (CommandRefusal $refusal) {
            $this->refuseStart($start, $refusal->getMessage());
        }
    }

    /**
     * A start that cannot run here at all is refused with the reason, and its session ends as a reported exit ends it,
     * so its runtime stops and the agent can start again.
     */
    public function refuseStart(SessionProcess $start, string $refusal): void
    {
        $start->refuse($refusal);
        $session = AgentSession::query()->findOrFail($start->session_id);
        $this->markExited($session, $refusal);
    }

    /**
     * A session with no process to stop ends at once with that evidence, as a reported exit ends it.
     */
    public function endIdle(AgentSession $session, string $evidence): void
    {
        $this->endSession($session, $evidence);
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
     * Ends each session that never beat and whose start still waits for a host since the cutoff, so the agent can start
     * again. A start whose host cannot be reached, or with no host while none can be reached,
     * waits up to half an hour instead.
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

        SessionProcess::query()->supervised()
            ->untakenSince($now->subMinutes(self::UNREACHABLE_HOST_WAIT_MINUTES), $cutoff, $unreachableHosts)
            ->limit(self::UNCLAIMED_ENDED_LIMIT)
            ->get()
            ->each(fn (SessionProcess $start) => $this->endUnclaimed($start->session_id, $now));
    }

    /**
     * Ends each session silent since the cutoff whose host still answers the journal within the presence window: the
     * host is there but no longer serves this one, so it never comes back by itself, also when it is the host's only
     * session, such as a start whose probe ended and whose container never opened.
     */
    private function endUnservedSince(CarbonImmutable $cutoff, CarbonImmutable $presenceCutoff): void
    {
        $unreachable = Host::query()->unreachableSince($presenceCutoff)->keys();
        $liveHosts = Host::query()->unrevoked()->excludingKeys($unreachable)->keys();

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

            // A start the journal claimed is as untaken as a pending one while its host takes up none of its processes.
            $isUntaken = in_array($start?->status, [
                SessionProcessStatus::Pending,
                SessionProcessStatus::Starting,
            ], true);

            // A start that waits for its host's driver image ends only on the image's bounded outcome or a cancel.
            if (! $isUntaken || HostDriverImageWait::hasOfStart($start->id)) {
                return;
            }

            $session = AgentSession::query()->findOrFail($sessionId);
            $session->endWithEvidenceAt($now, 'no host took up its start within the presence window');
            $start->cancelPending();
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
            ->withoutLiveRuntimeOf($this->drivers->drivenKeys())
            ->update(['status' => SessionStatus::Silent->value, 'silent_since' => $now]);
    }
}
