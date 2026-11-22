<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Policies\MessagePinPolicy;

/**
 * Removes the asker's pin of one message of a conversation.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(MessagePinPolicy::class, AccessType::Edit)]
final readonly class UnpinMessage extends Command
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
    ) {}
}
