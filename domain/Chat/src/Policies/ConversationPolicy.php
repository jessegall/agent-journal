<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Contracts\Authorization\WorkspacePolicy;
use Domain\Chat\Models\Conversation;

/**
 * Who may dock in a conversation and undock from it: every actor whose grants allow it; the handler then refuses an
 * actor that takes no part in the conversation.
 */
final readonly class ConversationPolicy implements WorkspacePolicy
{
    public static function model(): string
    {
        return Conversation::class;
    }
}
