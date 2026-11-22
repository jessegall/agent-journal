<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Leaves a chat; its owner may only leave once nobody else is in it, which closes it.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class LeaveChat extends Command
{
    public function __construct(
        public string $inboxId,
    ) {}
}
