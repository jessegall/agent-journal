<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Why a chosen conversation cannot be continued by a start, in the words Home and the CLI both show.
 */
enum ResumeRefusal: string
{
    case ConversationMissing = 'conversation-missing';
    case OtherAgent = 'other-agent';
    case OtherDriver = 'other-driver';
    case OtherContext = 'other-context';

    public function label(): string
    {
        return match ($this) {
            self::ConversationMissing => 'That conversation is not one this agent can continue.',
            self::OtherAgent => 'That conversation belongs to another agent.',
            self::OtherDriver => 'That conversation ran on another driver; start a new conversation instead.',
            self::OtherContext => 'That conversation was for other work; start a new conversation instead.',
        };
    }
}
