<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\DeviceGrantEvent;

/**
 * A device grant was issued to the device.
 */
final readonly class DeviceGrantIssued implements ConnectionEvent, DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
