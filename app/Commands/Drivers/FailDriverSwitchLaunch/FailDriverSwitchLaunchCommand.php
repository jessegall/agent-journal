<?php

declare(strict_types=1);

namespace App\Commands\Drivers\FailDriverSwitchLaunch;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Records that the replacement of a switch was refused, with its reason; the agent stays idle with its history.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class FailDriverSwitchLaunchCommand extends Command
{
    public function __construct(
        public string $switchId,
        public string $reason,
    ) {}
}
