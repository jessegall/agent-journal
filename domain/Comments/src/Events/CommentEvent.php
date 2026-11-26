<?php

declare(strict_types=1);

namespace Domain\Comments\Events;

use App\Contracts\Events\Event;

/**
 * A fact about comments: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface CommentEvent extends Event
{
    public string $commentId { get; }
}
