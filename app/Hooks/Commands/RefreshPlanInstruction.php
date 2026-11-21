<?php

declare(strict_types=1);

namespace App\Hooks\Commands;

use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Hooks\Handlers\RefreshPlanInstructionHandler;
use App\Operations\Enums\AccessType;

/**
 * Refreshes the instruction marker of the plan frame the engine runs this for, when the fact it answers names that
 * frame's own plan.
 *
 * @extends Command<null>
 */
#[HandledBy(RefreshPlanInstructionHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RefreshPlanInstruction extends Command
{
    public function __construct(public string $planId) {}
}
