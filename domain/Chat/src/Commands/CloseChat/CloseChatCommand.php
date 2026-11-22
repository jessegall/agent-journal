<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CloseChat;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Closes a chat the asker owns for good; its messages stay.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class CloseChatCommand extends Command
{
    public function __construct(
        public string $inboxId,
    ) {}
}
