<?php

declare(strict_types=1);

namespace App\Events\Connections;

/** The host is waiting for its processes to end before upgrading. */
final readonly class HostUpgradeAwaited implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
