<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

use App\Support\StartRemedy;

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

    /**
     * The public explanation of this refusal; a conversation of another agent reads as one that is unavailable.
     */
    public function explanation(): string
    {
        return match ($this) {
            self::ConversationMissing, self::OtherAgent => 'This conversation is unavailable to resume.',
            self::OtherDriver => 'This conversation uses a different driver.',
            self::OtherContext => 'This conversation cannot continue in this work.',
        };
    }

    public function remedy(): StartRemedy
    {
        return match ($this) {
            self::ConversationMissing, self::OtherAgent => StartRemedy::forEveryone(
                StartRemedyType::ChooseConversation,
                'Choose an eligible conversation',
            ),
            self::OtherDriver, self::OtherContext => StartRemedy::forEveryone(
                StartRemedyType::StartNewConversation,
                'Start a new conversation',
            ),
        };
    }
}
