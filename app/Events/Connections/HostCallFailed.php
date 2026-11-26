<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostCallEvent;

/**
 * The journal answered a host's call with a server error.
 */
final readonly class HostCallFailed implements ConnectionEvent, HostCallEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
