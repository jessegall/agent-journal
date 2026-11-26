<?php

declare(strict_types=1);

namespace App\Connections\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a project command: every event of it implements this, so a listener typed on it hears them all.
 */
interface ProjectCommandEvent extends Event
{
    public string $runId { get; }
}
