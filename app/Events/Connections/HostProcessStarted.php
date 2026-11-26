<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The host started the process, under the identity and generation it gave.
 */
final readonly class HostProcessStarted implements ConnectionEvent, HostProcessEvent
{
    public function __construct(
        public string $processId,
        public string|null $runtimeId,
        public int $generation,
        public string $identity,
    ) {}
}
