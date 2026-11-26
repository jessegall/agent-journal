<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The journal ordered a host to open a process, which may need a driver worker from now on.
 */
final readonly class HostProcessOpened implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public string|null $runtimeId) {}
}
