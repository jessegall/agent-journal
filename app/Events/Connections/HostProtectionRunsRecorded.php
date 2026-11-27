<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProtectionEvent;

/**
 * The operator recorded a run that showed boundary items hold on a host.
 */
final readonly class HostProtectionRunsRecorded implements ConnectionEvent, HostProtectionEvent
{
    public function __construct(
        public string $hostId,
    ) {}
}
