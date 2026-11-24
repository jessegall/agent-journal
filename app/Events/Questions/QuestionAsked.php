<?php

declare(strict_types=1);

namespace App\Events\Questions;

use App\Support\ActorIdentity;

/**
 * An actor asked another actor a question in an inbox.
 */
final readonly class QuestionAsked extends QuestionEvent
{
    public function __construct(public string $questionId, public string $inboxId, public ActorIdentity $sender, public ActorIdentity $target) {}
}
