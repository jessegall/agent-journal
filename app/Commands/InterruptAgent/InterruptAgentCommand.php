<?php

declare(strict_types=1);

namespace App\Commands\InterruptAgent;

use App\Attributes\Authorize;
use App\Contracts\Bus\AgentStackCommand;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\DriverReceipt;
use App\Values\StackTarget;

/**
 * Interrupts the runtime's current turn, holding it as Interrupted at once.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class InterruptAgentCommand extends Command implements AgentStackCommand
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
