<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CreateChatMessage;

use App\Attributes\Commands\RepeatableRead;
use App\Support\Command;
use Domain\Chat\Enums\ChatMessageType;

/**
 * Shows a source in an inbox's chat as the type given, once; only the chat domain's own listeners run it.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
final readonly class CreateChatMessageCommand extends Command
{
    public function __construct(
        public string $inboxId,
        public string $sourceType,
        public string $sourceId,
        public ChatMessageType $type,
    ) {}
}
