<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * The runner allowed a host's driver image, so its start checks may run.
 */
final readonly class DriverImageAllowed implements DriverImageEvent
{
    public function __construct(public string $hostDriverImageId) {}
}
