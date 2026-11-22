<?php

declare(strict_types=1);

namespace App\Agents\Commands\RetryDriverSwitch;

use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Retries the launch of a switch that failed, with the same request and target; the agent stays idle until then.
 *
 * @extends Command<null>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RetryDriverSwitchCommand extends Command
{
    public function __construct(public string $switchId) {}
}
