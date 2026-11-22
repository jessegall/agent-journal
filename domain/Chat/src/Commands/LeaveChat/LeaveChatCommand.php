<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\LeaveChat;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Leaves a chat; its owner may only leave once nobody else is in it, which closes it.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class LeaveChatCommand extends Command
{
    public function __construct(
        public string $inboxId,
    ) {}
}
