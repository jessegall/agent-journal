<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordAgentModel;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentRuntime;

final readonly class RecordAgentModelHandler implements CommandHandler
{
    public function handle(RecordAgentModelCommand $command): void
    {
        AgentRuntime::findLockedForSession($command->sessionId)->recordAppliedModel($command->model);
    }
}
