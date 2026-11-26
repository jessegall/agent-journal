<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\DeviceGrantEvent;

/**
 * A device polled its grant.
 */
final readonly class DeviceGrantPolled implements ConnectionEvent, DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
