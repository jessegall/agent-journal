<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a evidence permit: every event of it implements this, so a listener typed on it hears them all.
 */
interface EvidencePermitEvent extends Event
{
    public string $permitId { get; }
}
