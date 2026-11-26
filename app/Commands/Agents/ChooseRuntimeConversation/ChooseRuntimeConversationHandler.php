<?php

declare(strict_types=1);

namespace App\Commands\Agents\ChooseRuntimeConversation;

use App\Contracts\Bus\CommandHandler;
use App\Models\Agents\AgentRuntime;

final readonly class ChooseRuntimeConversationHandler implements CommandHandler
{
    public function handle(ChooseRuntimeConversationCommand $command): void
    {
        $runtime = AgentRuntime::query()->whereKey($command->runtimeId)->lockForUpdate()->sole();
        $runtime->chooseConversation($command->conversationId);
    }
}
