<?php

declare(strict_types=1);

namespace App\Agents\Commands\HoldAgentStack;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * A user keeps an agent's stack of one session, open or closed, and its hook calls past their retention, to
 * investigate it.
 *
 * @extends Command<void>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class HoldAgentStackCommand extends Command
{
    public function __construct(public StackTarget $target) {}
}
