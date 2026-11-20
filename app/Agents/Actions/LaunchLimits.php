<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Actors\Contracts\ServerClock;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\RevisionFence;
use App\Agents\Models\SessionPolicy;
use App\Agents\Support\DriverRequests;

/**
 * Stops the launches that may no longer run through the host's durable stop requests: a launch past its wall limit,
 * and every session started from a revoked profile revision. A stopped launch ends as any other, so its job is left
 * unfinished with a notice, never completed.
 */
final readonly class LaunchLimits
{
    /**
     * The most sessions one pass stops for each limit.
     */
    private const int PASS_LIMIT = 50;

    public function __construct(
        private DriverRequests $requests,
        private ServerClock $clock,
    ) {}

    /**
     * Stops each launch that outran the wall budget frozen with its start: six hours unless its profile set another.
     */
    public function stopOverdue(): void
    {
        $now = $this->clock->now();
        $launches = AgentSession::runningLaunches(self::PASS_LIMIT);
        $deadlines = SessionPolicy::wallDeadlinesOf($launches);

        foreach ($launches as $session) {
            if (array_key_exists($session->id, $deadlines) && $deadlines[$session->id]->isBefore($now)) {
                $this->stop($session, "wall-limit:{$session->id}");
            }
        }
    }

    /**
     * Stops what each pending fence still runs and marks the fence reconciled once nothing of its revision runs.
     */
    public function enforceFences(): void
    {
        foreach (RevisionFence::pending(self::PASS_LIMIT) as $fence) {
            $sessions = AgentSession::runningFromRevision(
                $fence->profile_key,
                $fence->profile_revision,
                self::PASS_LIMIT,
            );

            foreach ($sessions as $session) {
                $this->stop($session, "fence:{$fence->id}:{$session->id}");
            }

            if ($sessions === []) {
                $fence->markReconciledAt($this->clock->now());
            }
        }
    }

    private function stop(AgentSession $session, string $idempotencyKey): void
    {
        if (AgentRuntime::isRunningForSession($session->id)) {
            $this->requests->stop($session->target(), $idempotencyKey);
        }
    }
}
