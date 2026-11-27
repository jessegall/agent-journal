<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * A fact about a host's driver image: every event of that subject implements it, so a listener typed on it receives
 * them all.
 */
interface DriverImageEvent extends ConnectionEvent
{
    public string $hostDriverImageId { get; }
}
