<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

use App\Profiles\Values\AskTypeKey;
use App\Supervision\Values\SubjectType;

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

    public function subject(): SubjectType
    {
        return match ($this) {
            self::Question, self::Stuck => new SubjectType('question', requiresWork: false),
            self::ReviewReady => new SubjectType('code-review'),
            self::MergeReady => new SubjectType('merge'),
        };
    }

    public function minutes(): int
    {
        return $this === self::ReviewReady ? 60 : 15;
    }
}
