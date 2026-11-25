<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\UnpinMessage;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Chat\Policies\MessagePinPolicy;

/**
 * Removes the asker's pin of one message of a conversation.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(MessagePinPolicy::class, AccessType::Edit)]
final readonly class UnpinMessageCommand extends Command
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
    ) {}
}
