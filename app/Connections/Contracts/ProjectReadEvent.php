<?php

declare(strict_types=1);

namespace App\Connections\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a project read: every event of it implements this, so a listener typed on it receives them all.
 */
interface ProjectReadEvent extends Event
{
    public string $readId { get; }
}
