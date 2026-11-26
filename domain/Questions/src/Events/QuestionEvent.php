<?php

declare(strict_types=1);

namespace Domain\Questions\Events;

use App\Contracts\Events\Event;

/**
 * A fact about a question: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface QuestionEvent extends Event
{
    public string $questionId { get; }
}
