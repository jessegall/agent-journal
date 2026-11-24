<?php

declare(strict_types=1);

namespace App\Events;

/**
 * The journal answered a host's call, after failing ones, a long quiet or the host's own report of failed calls.
 */
final readonly class HostCallAnswered extends ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
