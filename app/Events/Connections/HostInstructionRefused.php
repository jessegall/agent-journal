<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostInstructionAnswerEvent;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRefusal;

/**
 * The host refused the instruction, or it expired before a host answered it.
 */
final readonly class HostInstructionRefused implements ConnectionEvent, HostInstructionAnswerEvent
{
    public function __construct(
        public string $instructionId,
        public string|null $processId,
        public HostInstructionType $type,
        public HostRefusal $refusal,
        public string|null $reason,
    ) {}
}
