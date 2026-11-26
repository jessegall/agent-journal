<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Contracts\Events\Event;

/**
 * A host's call failed or was answered, which raises or clears its link alarm.
 */
interface HostCallEvent extends Event
{
    public string $hostId { get; }
}
