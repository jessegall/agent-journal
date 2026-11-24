<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\DeviceGrantEvent;

/**
 * A device grant was revoked.
 */
final readonly class DeviceGrantRevoked extends ConnectionEvent implements DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
