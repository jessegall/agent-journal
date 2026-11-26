<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProcessEvent;

/**
 * The host listed the process in a heartbeat again after it had missed some.
 */
final readonly class HostProcessSeenInHeartbeat implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId) {}
}
