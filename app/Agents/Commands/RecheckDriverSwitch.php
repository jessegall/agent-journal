<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RecheckDriverSwitchHandler;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Rechecks a switch whose stop or start is unconfirmed, from what the host last reported of that session's process;
 * it moves only through the switch's own stages, so it never makes a second writer.
 *
 * @extends Command<null>
 */
#[HandledBy(RecheckDriverSwitchHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RecheckDriverSwitch extends Command
{
    public function __construct(public string $switchId) {}
}
