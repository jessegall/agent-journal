<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * A host reported one of its protections.
 */
final readonly class HostProtectionRecorded extends ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
