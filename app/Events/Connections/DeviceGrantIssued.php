<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\DeviceGrantEvent;

/**
 * A device grant was issued to the device.
 */
final readonly class DeviceGrantIssued extends ConnectionEvent implements DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
