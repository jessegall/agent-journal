<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportRuntimeExit;
use App\Agents\Models\AgentSession;
use App\Agents\Support\DriverHeartbeatSource;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\RuntimeExit;
use App\Contracts\CommandHandler;

final readonly class ReportRuntimeExitHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes, private DriverHeartbeatSource $heartbeats) {}

    public function handle(ReportRuntimeExit $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $session = AgentSession::query()->with(['credential', 'agent'])->findOrFail($runtime->agent_session_id);

        $this->heartbeats->recordExit(
            $session,
            new RuntimeExit($command->hostId, $command->processGeneration, $command->evidence),
        );
    }
}
