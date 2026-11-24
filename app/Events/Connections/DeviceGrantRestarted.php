<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\DeviceGrantEvent;

/**
 * A device grant began again with a new device code.
 */
final readonly class DeviceGrantRestarted extends ConnectionEvent implements DeviceGrantEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
