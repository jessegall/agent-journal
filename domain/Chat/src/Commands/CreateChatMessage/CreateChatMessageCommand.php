<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CreateChatMessage;

use App\Support\Command;
use Domain\Chat\Enums\ChatMessageType;

/**
 * Makes the chat show a message as the type given.
 *
 * @extends Command<null>
 */
final readonly class CreateChatMessageCommand extends Command
{
    public function __construct(public string $messageId, public ChatMessageType $type) {}
}
