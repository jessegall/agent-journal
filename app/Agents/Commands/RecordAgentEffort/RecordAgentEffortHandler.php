<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordAgentEffort;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentRuntime;

final readonly class RecordAgentEffortHandler implements CommandHandler
{
    public function handle(RecordAgentEffortCommand $command): void
    {
        AgentRuntime::findLockedForSession($command->sessionId)->recordAppliedEffort($command->effort);
    }
}
