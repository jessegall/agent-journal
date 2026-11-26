<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * The host sent a heartbeat.
 */
final readonly class HostHeartbeatRecorded implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
