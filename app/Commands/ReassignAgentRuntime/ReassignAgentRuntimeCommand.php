<?php

declare(strict_types=1);

namespace App\Commands\ReassignAgentRuntime;

use App\Attributes\Authorize;
use App\Contracts\Bus\AgentStackCommand;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * An operator moves a lost runtime to a new process, on its own host or another, once they have proof that the old
 * process stopped: the session keeps going under a rotated credential. The new process generation is the answer.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class ReassignAgentRuntimeCommand extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public int $expectedGeneration,
        public string|null $hostId,
        public string $proof,
        public string $reason,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
