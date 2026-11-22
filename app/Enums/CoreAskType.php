<?php

declare(strict_types=1);

namespace App\Enums;

use App\Commands\ApproveCodeReview\ApproveCodeReviewCommand;
use App\Commands\MergeReviewedWork\MergeReviewedWorkCommand;
use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Command;
use App\Values\AskTypeKey;
use App\Values\SubjectType;

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

    /**
     * The command whose admission an answer to an ask of this type needs.
     *
     * @return class-string<Command<mixed>>
     */
    public function requiredCommand(): string
    {
        return match ($this) {
            self::Question, self::Stuck => ReplyToMessageCommand::class,
            self::ReviewReady => ApproveCodeReviewCommand::class,
            self::MergeReady => MergeReviewedWorkCommand::class,
        };
    }

    public function subject(): SubjectType
    {
        return match ($this) {
            self::Question, self::Stuck => new SubjectType('question', isWorkRequired: false),
            self::ReviewReady => new SubjectType('code-review'),
            self::MergeReady => new SubjectType('merge'),
        };
    }

    public function minutes(): int
    {
        return $this === self::ReviewReady ? 60 : 15;
    }

    /**
     * Whether an ask of this type is served before review and merge asks in its holder's queue.
     */
    public function isUrgent(): bool
    {
        return $this === self::Question || $this === self::Stuck;
    }

    /**
     * @return list<string>
     */
    public static function urgentKeys(): array
    {
        return [self::Question->value, self::Stuck->value];
    }
}
