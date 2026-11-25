<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Support\ActorIdentity;
use RuntimeException;

/**
 * A question that cannot be asked, read or answered, with the reason.
 */
final class QuestionRefused extends RuntimeException implements CommandRefusal
{
    public static function targetCannotAnswer(ActorIdentity $target): self
    {
        return new self("The {$target->type} {$target->id} cannot be asked a question.");
    }

    public static function targetNotInInbox(ActorIdentity $target): self
    {
        return new self("The {$target->type} {$target->id} is not attached to the inbox.");
    }

    public static function choiceNeedsOptions(): self
    {
        return new self('A choice question needs two or more different, non-blank options.');
    }

    public static function openTakesNoOptions(): self
    {
        return new self('An open question takes no options.');
    }

    public static function notTheTarget(string $questionId): self
    {
        return new self("Only the actor question {$questionId} was asked of may answer it.");
    }

    public static function notInvolved(string $questionId): self
    {
        return new self("Only the actor who asked question {$questionId} or was asked it may read it.");
    }

    public static function alreadyAnswered(string $questionId): self
    {
        return new self("Question {$questionId} is already answered.");
    }

    public static function notAnOption(string $questionId): self
    {
        return new self("The answer to question {$questionId} must be one of its options.");
    }
}
