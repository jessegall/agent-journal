<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChooseRuntimeConversation;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Time\Contracts\ServerClock;

final readonly class ChooseRuntimeConversationHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(ChooseRuntimeConversationCommand $command): void
    {
        $runtime = AgentRuntime::query()->whereKey($command->runtimeId)->lockForUpdate()->sole();
        $runtime->nameConversation($command->conversationId, $this->clock->now());
    }
}
