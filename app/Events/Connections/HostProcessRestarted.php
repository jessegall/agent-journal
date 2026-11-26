<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The host healed the process's crashed container and runs it again.
 */
final readonly class HostProcessRestarted implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public int $generation, public string $identity) {}
}
