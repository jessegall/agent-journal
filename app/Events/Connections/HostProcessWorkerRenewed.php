<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProcessEvent;

/**
 * The process's driver worker renewed its lease.
 */
final readonly class HostProcessWorkerRenewed implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public int $generation) {}
}
