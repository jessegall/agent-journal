<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostInstructionEvent;

/**
 * The instruction a host's earlier process claimed is offered to the host again, as the host started anew.
 */
final readonly class HostInstructionOfferedAgain implements ConnectionEvent, HostInstructionEvent
{
    public function __construct(public string $instructionId, public string|null $processId) {}
}
