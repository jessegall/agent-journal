<?php

declare(strict_types=1);

namespace App\Commands\Agents\RetireAgent;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\AssignmentResult;
use App\Support\Command;

/**
 * Retires an agent: the owner may retire any agent, a main agent any agent that is not a main agent.
 *
 * @extends Command<AssignmentResult>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RetireAgentCommand extends Command
{
    public function __construct(public string $agentId) {}
}
