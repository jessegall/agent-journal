<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Contracts\Authorization\Policy;
use Domain\Chat\Models\MessageReaction;

/**
 * Who may react to a message, as the access grants for reactions say.
 */
final readonly class MessageReactionPolicy implements Policy
{
    public static function model(): string
    {
        return MessageReaction::class;
    }
}
