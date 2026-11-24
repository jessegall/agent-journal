<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Commands\RecordHeartbeat\RecordHeartbeatHandler;
use App\Exceptions\CredentialRejected;
use App\Exceptions\HostReportRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;

/**
 * The driver side of the heartbeat: evidence from the host that runs the session's current process refreshes its
 * presence by RecordHeartbeatCommand's own rule, inside the host's command and for its actor, and a verified exit ends it
 * through the start lifecycle. Silence ends nothing.
 */
final readonly class DriverHeartbeatSource
{
    public function __construct(private RecordHeartbeatHandler $beats, private HeartbeatService $heartbeats) {}

    public function record(AgentSession $session, HeartbeatEvidence $evidence, ActorContext $actor): void
    {
        $this->requireCurrent($session, $evidence->hostId, $evidence->processGeneration);

        $this->beats->handle(new RecordHeartbeatCommand($session->id)->withDispatcher($actor));
    }

    public function recordExit(AgentSession $session, RuntimeExit $exit): void
    {
        $this->requireCurrent($session, $exit->hostId, $exit->processGeneration);

        if (! $session->isActive()) {
            throw CredentialRejected::sessionEnded();
        }

        $this->heartbeats->markExited($session, $exit->evidence);
    }

    private function requireCurrent(AgentSession $session, string $hostId, int $processGeneration): void
    {
        $runtime = AgentRuntime::query()->where('agent_session_id', $session->id)->limit(1)->first();

        if ($runtime === null || $runtime->host_id !== $hostId) {
            throw HostReportRefused::notOwned($runtime->id ?? $session->id);
        }

        if ($processGeneration !== $runtime->process_generation) {
            throw HostReportRefused::staleGeneration($runtime->id, $processGeneration, $runtime->process_generation);
        }
    }
}
