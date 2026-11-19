<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\RetireAgentHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * Retires an agent: the owner may retire any agent, a main agent any agent that is not a main agent.
 *
 * @implements Command<AssignmentResult>
 */
#[HandledBy(RetireAgentHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
final readonly class RetireAgent implements Command, HasAuthorizationSubject
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
