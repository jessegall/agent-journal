<?php

declare(strict_types=1);

namespace App\Events\Connections;

/** The host recorded the release it runs. */
final readonly class HostReleaseRecorded implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
