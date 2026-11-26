<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Contracts\Events\Event;

/**
 * A process on a host started, was healed, exited or was lost: what a worker and its supervisor wake on.
 */
interface HostProcessEvent extends Event
{
    public string $processId { get; }
}
