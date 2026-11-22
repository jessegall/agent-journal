<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\OpenPairChat;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Chat\Policies\ConversationPolicy;

/**
 * Opens the user's direct chat with one agent it may see, or finds the one it already has; the answer is the chat's
 * inbox id.
 *
 * @extends Command<string>
 */
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class OpenPairChatCommand extends Command
{
    public function __construct(public string $agentId) {}
}
