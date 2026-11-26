<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a stop attempt: every event of it implements this, so a listener typed on it hears them all.
 */
interface StopCheckEvent extends Event
{
    public string $attemptId { get; }
}
