<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Agents\Commands\RecordHeartbeat\RecordHeartbeatHandler;
use App\Exceptions\HostReportRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Sessions\RuntimeExit;
use App\Sessions\StartHeartbeats;
use App\Support\ActorReference;

/**
 * The driver side of the heartbeat: evidence from the host that runs the session's current process refreshes its
 * presence by RecordHeartbeatCommand's own rule, inside the host's command and for its actor, and a verified exit ends it
 * through the start lifecycle. Silence ends nothing.
 */
final readonly class DriverHeartbeatSource
{
    public function __construct(private RecordHeartbeatHandler $beats, private StartHeartbeats $heartbeats) {}

    public function record(AgentSession $session, HeartbeatEvidence $evidence, ActorReference $actor): void
    {
        $this->requireCurrent($session, $evidence->hostId, $evidence->processGeneration);

        $this->beats->handle(new RecordHeartbeatCommand($session->id)->withDispatcher($actor));
    }

    public function recordExit(AgentSession $session, RuntimeExit $exit): void
    {
        $this->requireCurrent($session, $exit->hostId, $exit->processGeneration);

        // An exit that arrives after the session ended, such as one its stop ended on, only confirms that end.
        if (! $session->isActive()) {
            return;
        }

        $this->heartbeats->markExited($session, $exit->evidence);
    }

    private function requireCurrent(AgentSession $session, string $hostId, int $processGeneration): void
    {
        $runtime = AgentRuntime::query()->ofAgentSession($session->id)->limit(1)->first();

        if ($runtime === null || $runtime->host_id !== $hostId) {
            throw HostReportRefused::notOwned($runtime->id ?? $session->id);
        }

        // A newer generation is the host's restart of the driver, which its next activity report records; only a
        // report of a generation already replaced is refused, as turn and activity reports are.
        if ($processGeneration < $runtime->process_generation) {
            throw HostReportRefused::staleGeneration($runtime->id, $processGeneration, $runtime->process_generation);
        }
    }
}
