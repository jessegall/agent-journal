<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProcessEvent;

/**
 * A new driver worker took the process over, under the next worker generation.
 */
final readonly class HostProcessWorkerClaimed implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public int $generation) {}
}
