<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * A start's wait for its host's driver image was served, and the wait is gone.
 */
final readonly class DriverImageWaitServed implements DriverImageEvent
{
    public function __construct(
        public string $hostDriverImageId,
        public string $sessionProcessId,
    ) {}
}
