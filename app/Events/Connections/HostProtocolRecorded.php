<?php

declare(strict_types=1);

namespace App\Events\Connections;

/** The host recorded the protocol it uses. */
final readonly class HostProtocolRecorded implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
