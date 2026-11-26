<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostCallEvent;

/**
 * The journal answered a host's call, after failing ones, a long quiet or the host's own report of failed calls.
 */
final readonly class HostCallAnswered implements ConnectionEvent, HostCallEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
