<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProcessEvent;

/**
 * The process took the number of its next instruction.
 */
final readonly class HostProcessInstructionNumbered implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public int $sequence) {}
}
