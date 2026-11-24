<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostCallEvent;

/**
 * The journal answered a host's call with a server error.
 */
final readonly class HostCallFailed extends ConnectionEvent implements HostCallEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
