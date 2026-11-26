<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a start token: every event of it implements this, so a listener typed on it hears them all.
 */
interface SessionTokenEvent extends Event
{
    public string $tokenId { get; }
}
