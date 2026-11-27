<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Hosts\Protocol\HostInstructionType;

/**
 * A host answered an instruction, or refused it, or it expired unanswered: the instruction's worker reads the answer.
 */
interface HostInstructionAnswerEvent extends HostInstructionEvent
{
    public HostInstructionType $type { get; }
}
