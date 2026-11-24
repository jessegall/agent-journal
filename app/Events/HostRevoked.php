<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A host was revoked.
 */
final readonly class HostRevoked extends ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
