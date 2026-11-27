<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Contracts\Events\Event;

/**
 * Something happened to one instruction the journal made for a host: it was made, claimed, answered or refused.
 */
interface HostInstructionEvent extends Event
{
    public string $instructionId { get; }

    public string|null $processId { get; }
}
