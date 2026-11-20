<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RetireAgentHandler;
use App\Agents\Policies\AgentPolicy;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Retires an agent: the owner may retire any agent, a main agent any agent that is not a main agent.
 *
 * @extends Command<AssignmentResult>
 */
#[HandledBy(RetireAgentHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RetireAgent extends Command
{
    public function __construct(public string $agentId) {}
}
