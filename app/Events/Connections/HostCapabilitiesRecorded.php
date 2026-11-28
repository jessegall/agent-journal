<?php

declare(strict_types=1);

namespace App\Events\Connections;

/** The host recorded the instruction types it supports. */
final readonly class HostCapabilitiesRecorded implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
