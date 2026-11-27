<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Contracts\Events\Event;

/**
 * Something was recorded about one host's protections: a protection it reported, or a run that showed them hold.
 */
interface HostProtectionEvent extends Event
{
    public string $hostId { get; }
}
