<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostInstructionEvent;

/**
 * The journal made an instruction for the host, which wakes the host's claim once it commits.
 */
final readonly class HostInstructionMade implements ConnectionEvent, HostInstructionEvent
{
    public function __construct(public string $instructionId, public string|null $processId, public string $hostId) {}
}
