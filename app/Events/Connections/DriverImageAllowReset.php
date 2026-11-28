<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * A host restarted, so its ready driver image goes back to be allowed by the runner that now runs.
 */
final readonly class DriverImageAllowReset implements DriverImageEvent
{
    public function __construct(public string $hostDriverImageId) {}
}
