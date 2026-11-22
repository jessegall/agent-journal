<?php

declare(strict_types=1);

namespace App\Commands\ReportRuntimeHeartbeat;

use App\Contracts\Bus\CommandHandler;
use App\Models\AgentSession;
use App\Support\DriverHeartbeatSource;
use App\Support\HeartbeatEvidence;
use App\Support\HostRuntimes;

final readonly class ReportRuntimeHeartbeatHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes, private DriverHeartbeatSource $heartbeats) {}

    public function handle(ReportRuntimeHeartbeatCommand $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $session = AgentSession::query()->findOrFail($runtime->agent_session_id);

        $evidence = new HeartbeatEvidence($command->hostId, $command->processGeneration, $command->evidence);
        $this->heartbeats->record($session, $evidence, $command->dispatchedBy());
    }
}
