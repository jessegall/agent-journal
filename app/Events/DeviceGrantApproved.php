<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\DeviceGrantEvent;

/**
 * A user approved a device grant.
 */
final readonly class DeviceGrantApproved extends ConnectionEvent implements DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
        public string $userId,
    ) {}
}
