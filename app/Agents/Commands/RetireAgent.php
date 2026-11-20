<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\RetireAgentHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * Retires an agent: the owner may retire any agent, a main agent any agent that is not a main agent.
 *
 * @extends Command<AssignmentResult>
 */
#[HandledBy(RetireAgentHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('retire_agent', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class RetireAgent extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $agentId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
