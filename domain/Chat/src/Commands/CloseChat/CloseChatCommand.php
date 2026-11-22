<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CloseChat;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
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
