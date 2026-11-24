<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A host advertised which browser input its terminals take.
 */
final readonly class HostBrowserInputAdvertised extends ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
