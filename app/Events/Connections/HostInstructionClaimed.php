<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostInstructionEvent;

/**
 * The host claimed the instruction to carry it out.
 */
final readonly class HostInstructionClaimed implements ConnectionEvent, HostInstructionEvent
{
    public function __construct(public string $instructionId, public string|null $processId) {}
}
