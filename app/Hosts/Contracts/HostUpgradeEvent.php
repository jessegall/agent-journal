<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Events\Connections\ConnectionEvent;

/**
 * A change to the upgrade a host was asked to carry out.
 */
interface HostUpgradeEvent extends ConnectionEvent
{
    public string $hostId { get; }
}
