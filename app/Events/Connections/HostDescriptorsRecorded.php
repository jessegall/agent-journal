<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * A host reported its descriptors.
 */
final readonly class HostDescriptorsRecorded extends ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
