<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

use App\Profiles\Values\AskTypeKey;

enum CoreAskType: string
{
    case Question = 'question';
    case Stuck = 'stuck';
    case ReviewReady = 'review.ready';
    case MergeReady = 'merge.ready';

    public function key(): AskTypeKey
    {
        return AskTypeKey::from($this->value);
    }

    public function operation(): string
    {
        return match ($this) {
            self::Question, self::Stuck => 'messages_reply',
            self::ReviewReady => 'verify_restored_output',
            self::MergeReady => 'publish_merge',
        };
    }
}
