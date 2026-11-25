<?php

declare(strict_types=1);

namespace App\Commands\Agents\NotifyRuntimeExit;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Sessions\SessionStateChanged;
use App\Models\Agents\AgentSession;
use App\Support\DriverHeartbeatSource;
use App\Support\HostRuntimes;
use App\Support\RuntimeExit;

final readonly class NotifyRuntimeExitHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private DriverHeartbeatSource $heartbeats,
        private CommandFacts $facts,
    ) {}

    public function handle(NotifyRuntimeExitCommand $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $session = AgentSession::query()->with([
            'startToken',
            'agent',
        ])->findOrFail($runtime->agent_session_id);

        $this->heartbeats->recordExit(
            $session,
            new RuntimeExit($command->hostId, $command->processGeneration, $command->evidence),
        );

        $this->facts->publishAfterCommit(new SessionStateChanged($session->id));
    }
}
