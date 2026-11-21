<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStackCommand;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\DriverReceipt;
use App\Agents\Values\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Wakes an agent's runtime for waiting work; a wake already open is raised instead of adding another.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class WakeAgent extends Command implements AgentStackCommand
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
