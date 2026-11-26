<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\DeviceGrantEvent;

/**
 * A user approved a device grant.
 */
final readonly class DeviceGrantApproved implements ConnectionEvent, DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
        public string $userId,
    ) {}
}
