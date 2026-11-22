<?php

declare(strict_types=1);

namespace App\Commands\RecheckDriverSwitch;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;

/**
 * Rechecks a switch whose stop or start is unconfirmed, from what the host last reported of that session's process;
 * it moves only through the switch's own stages, so it never makes a second writer.
 *
 * @extends Command<null>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RecheckDriverSwitchCommand extends Command
{
    public function __construct(public string $switchId) {}
}
