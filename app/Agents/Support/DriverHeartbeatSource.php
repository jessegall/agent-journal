<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Actions\LaunchHeartbeats;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Contracts\AgentHeartbeatSource;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Handlers\RecordHeartbeatHandler;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;

/**
 * The driver side of the heartbeat: evidence from the host that runs the session's current process refreshes its
 * presence by RecordHeartbeat's own rule, inside the host's command, and a verified exit ends it through the launch lifecycle. Silence ends nothing.
 */
final readonly class DriverHeartbeatSource implements AgentHeartbeatSource
{
    public function __construct(private RecordHeartbeatHandler $beats, private LaunchHeartbeats $heartbeats) {}

    public function record(AgentSession $session, RuntimeEvidence $evidence): void
    {
        $this->requireCurrent($session, $evidence->hostId, $evidence->processGeneration);

        $this->beats->handle(new RecordHeartbeat($session->id));
    }

    public function recordExit(AgentSession $session, RuntimeExit $exit): void
    {
        $this->requireCurrent($session, $exit->hostId, $exit->processGeneration);
        $session->requireUsable();

        $this->heartbeats->markExited($session, $exit->evidence);
    }

    private function requireCurrent(AgentSession $session, string $hostId, int $processGeneration): void
    {
        $runtime = AgentRuntime::query()->where('agent_session_id', $session->id)->readLimit(1)->first();

        if ($runtime === null || $runtime->host_id !== $hostId) {
            throw HostReportRefused::notOwned($runtime->id ?? $session->id);
        }

        if ($processGeneration !== $runtime->process_generation) {
            throw HostReportRefused::staleGeneration($runtime->id, $processGeneration, $runtime->process_generation);
        }
    }
}
