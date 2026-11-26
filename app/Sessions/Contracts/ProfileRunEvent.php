<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a profile run: every event of it implements this, so a listener typed on it receives them all.
 */
interface ProfileRunEvent extends Event
{
    public string $runId { get; }
}
