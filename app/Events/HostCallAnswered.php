<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Hosts\HostCallEvent;

/**
 * The journal answered a host's call, after failing ones, a long quiet or the host's own report of failed calls.
 */
final readonly class HostCallAnswered extends ConnectionEvent implements HostCallEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
