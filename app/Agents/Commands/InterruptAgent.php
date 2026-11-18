<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\InterruptAgentHandler;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Interrupts the runtime's current turn, holding it as Interrupted at once.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(InterruptAgentHandler::class)]
final readonly class InterruptAgent implements Command
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
