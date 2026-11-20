<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\TargetsAgentStack;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ReassignAgentRuntimeHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * An operator moves a lost runtime to a new process, on its own host or another, once they have proof that the old
 * process stopped: the session keeps going under a rotated credential. The new process generation is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(ReassignAgentRuntimeHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('reassign_agent_runtime', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ReassignAgentRuntime extends Command implements AuthorizedCommand, TargetsAgentStack
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
