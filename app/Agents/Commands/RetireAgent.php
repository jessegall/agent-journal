<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RetireAgentHandler;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Retires an agent: the owner may retire any agent, a main agent any agent that is not a main agent.
 *
 * @implements Command<AssignmentResult>
 */
#[HandledBy(RetireAgentHandler::class)]
final readonly class RetireAgent implements Command
{
    public function __construct(public string $agentId) {}
}
