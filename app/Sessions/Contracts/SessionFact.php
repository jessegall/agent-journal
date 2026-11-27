<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Contracts\Events\Event;

/**
 * A fact about one session, which names it: a state of that session's stack hears it, a state of another stack does
 * not. A fact of no session, such as a probe the host runs for itself, names none.
 */
interface SessionFact extends Event
{
    public string|null $sessionId { get; }
}
