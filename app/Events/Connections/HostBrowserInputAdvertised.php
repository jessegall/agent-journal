<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * A host advertised which browser input its terminals take.
 */
final readonly class HostBrowserInputAdvertised implements ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
