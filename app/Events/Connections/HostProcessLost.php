<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProcessEndEvent;

/**
 * The host no longer holds the process, as its inventory or two heartbeats in a row say.
 */
final readonly class HostProcessLost implements ConnectionEvent, HostProcessEndEvent
{
    public function __construct(
        public string $processId,
        public string|null $runtimeId,
        public string|null $sessionId,
        public string $evidence,
    ) {}
}
