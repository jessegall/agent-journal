<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * How well an eligible helper fits a new launch (doc 14 decision D5): same purpose with a conversation on the chosen
 * program and exact model, same purpose with an adapter-confirmed compatible model, same purpose without a usable
 * conversation, or another purpose. Model strength and cache age never count.
 */
enum LaunchCandidateRank: int
{
    case ExactConversation = 1;
    case CompatibleConversation = 2;
    case SamePurpose = 3;
    case OtherPurpose = 4;

    public function reason(): string
    {
        return match ($this) {
            self::ExactConversation => 'It did this work before on the chosen program and model.',
            self::CompatibleConversation => 'It did this work before on a model the adapter confirms compatible.',
            self::SamePurpose => 'It did this work before, with no conversation the chosen program and model can use.',
            self::OtherPurpose => 'It is free and did other work; it starts a new conversation.',
        };
    }
}
