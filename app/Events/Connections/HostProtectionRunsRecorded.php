<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * The operator recorded a run that showed boundary items hold on a host.
 */
final readonly class HostProtectionRunsRecorded implements ConnectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
