<?php

declare(strict_types=1);

namespace App\Agents\Commands\NotifyRuntimeExit;

use App\Agents\DriverHeartbeatSource;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\SessionStateChanged;
use App\Hosts\HostRuntimes;
use App\Models\Agents\AgentSession;
use App\Sessions\RuntimeExit;

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
        $session = AgentSession::query()->withSessionTokenAndAgent()->findOrFail($runtime->agent_session_id);

        $this->heartbeats->recordExit(
            $session,
            new RuntimeExit($command->hostId, $command->processGeneration, $command->evidence),
        );

        $this->facts->publishAfterCommit(new SessionStateChanged($session->id));
    }
}
