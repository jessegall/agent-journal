<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProtectionEvent;

/**
 * A host reported one of its protections.
 */
final readonly class HostProtectionRecorded implements ConnectionEvent, HostProtectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
