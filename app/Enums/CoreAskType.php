<?php

declare(strict_types=1);

namespace App\Enums;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Commands\Reviews\ApproveCodeReview\ApproveCodeReviewCommand;
use App\Commands\Reviews\MergeReviewedWork\MergeReviewedWorkCommand;
use App\Contracts\Bus\Command;
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
        return AskTypeKey::of($this->value);
    }

    /**
     * The command whose admission an answer to an ask of this type needs.
     *
     * @return class-string<Command<mixed>>
     */
    public function requiredCommand(): string
    {
        return match ($this) {
            self::Question, self::Stuck => SendMessageCommand::class,
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
        if ($this === self::ReviewReady) {
            return 60;
        }

        return 15;
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
        return [
            self::Question->value,
            self::Stuck->value,
        ];
    }
}
