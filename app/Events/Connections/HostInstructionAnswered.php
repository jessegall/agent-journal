<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostInstructionAnswerEvent;
use App\Hosts\Protocol\HostInstructionType;

/**
 * The host carried out the instruction.
 */
final readonly class HostInstructionAnswered implements ConnectionEvent, HostInstructionAnswerEvent
{
    public function __construct(public string $instructionId, public string|null $processId, public HostInstructionType $type) {}
}
