<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\ToggleReaction;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Chat\Policies\MessageReactionPolicy;

/**
 * Adds the asking user's or agent's reaction to a readable message of a chat, or takes it back; answers whether it is
 * there now.
 *
 * @extends Command<bool>
 */
#[Authorize(MessageReactionPolicy::class, AccessType::Edit)]
final readonly class ToggleReactionCommand extends Command
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
        public string $emoji,
    ) {}
}
