<?php

declare(strict_types=1);

namespace App\Commands\Agents\HoldAgentStack;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
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
