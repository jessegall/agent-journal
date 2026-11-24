<?php

declare(strict_types=1);

namespace App\Events;

/**
 * The journal answered a host's call with a server error.
 */
final readonly class HostCallFailed extends ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
