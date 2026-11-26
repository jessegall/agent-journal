<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The host sent the pipe process's standard output through the offset.
 */
final readonly class HostProcessOutputRecorded implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public int $offset) {}
}
