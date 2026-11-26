<?php

declare(strict_types=1);

namespace App\Events\Access;

use App\Contracts\Events\Event;

/**
 * A fact about users and their grants: every event of that subject implements it, so a listener typed on it receives them
 * all.
 */
interface AccessEvent extends Event
{
    public string $grantId { get; }
}
