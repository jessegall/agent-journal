<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CreateChatMessage;

use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Models\ChatMessage;

/**
 * Records the chat message.
 */
final readonly class CreateChatMessageHandler extends ChatCommandHandler
{
    public function handle(CreateChatMessageCommand $command): void
    {
        ChatMessage::record($command->messageId, $command->type);
    }
}
