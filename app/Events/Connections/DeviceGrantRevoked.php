<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\DeviceGrantEvent;

/**
 * A device grant was revoked.
 */
final readonly class DeviceGrantRevoked implements ConnectionEvent, DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
