<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Contracts\AgentHeartbeatSource;
use App\Agents\Models\AgentSession;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\RuntimeEvidence;
use App\Contracts\CommandHandler;

final readonly class ReportRuntimeHeartbeatHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes, private AgentHeartbeatSource $heartbeats) {}

    public function handle(ReportRuntimeHeartbeat $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $session = AgentSession::query()->findOrFail($runtime->agent_session_id);

        $this->heartbeats->record($session, new RuntimeEvidence($command->hostId, $command->processGeneration, $command->evidence));
    }
}
