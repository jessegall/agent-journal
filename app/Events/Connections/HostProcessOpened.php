<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProcessEvent;
use App\Sessions\Contracts\SessionFact;

/**
 * The journal ordered a host to open a process, which may need a driver worker from now on.
 */
final readonly class HostProcessOpened implements ConnectionEvent, HostProcessEvent, SessionFact
{
    public function __construct(
        public string $processId,
        public string|null $runtimeId,
        public string|null $sessionId,
    ) {}
}
