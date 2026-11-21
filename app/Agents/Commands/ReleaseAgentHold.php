<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStackCommand;
use App\Agents\Enums\HoldReason;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Values\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user releases the hold they read on an agent's runtime: an interrupt or a call for attention, never a hold the
 * program itself shows.
 *
 * @extends Command<void>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class ReleaseAgentHold extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public HoldReason $expectedHold,
        public string $reason,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
