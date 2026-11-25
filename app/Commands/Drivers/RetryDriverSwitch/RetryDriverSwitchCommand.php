<?php

declare(strict_types=1);

namespace App\Commands\Drivers\RetryDriverSwitch;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;

/**
 * Retries the start of a switch that failed, with the same request and target; the agent stays idle until then.
 *
 * @extends Command<null>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RetryDriverSwitchCommand extends Command
{
    public function __construct(public string $switchId) {}
}
