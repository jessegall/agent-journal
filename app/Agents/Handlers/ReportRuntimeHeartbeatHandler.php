<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Models\AgentSession;
use App\Agents\Support\DriverHeartbeatSource;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\RuntimeEvidence;
use App\Contracts\CommandHandler;

final readonly class ReportRuntimeHeartbeatHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes, private DriverHeartbeatSource $heartbeats) {}

    public function handle(ReportRuntimeHeartbeat $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $session = AgentSession::query()->findOrFail($runtime->agent_session_id);

        $evidence = new RuntimeEvidence($command->hostId, $command->processGeneration, $command->evidence);
        $this->heartbeats->record($session, $evidence, $command->dispatchedBy());
    }
}
