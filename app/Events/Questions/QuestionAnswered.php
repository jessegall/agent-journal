<?php

declare(strict_types=1);

namespace App\Events\Questions;

use App\Support\ActorIdentity;

/**
 * The target of a question answered it.
 */
final readonly class QuestionAnswered extends QuestionEvent
{
    public function __construct(public string $questionId, public string $inboxId, public ActorIdentity $answerer) {}
}
