<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\FailDriverSwitchStart;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Records that the replacement of a switch was refused, with its reason; the agent stays idle with its history.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class FailDriverSwitchStartCommand extends Command
{
    public function __construct(
        public string $switchId,
        public string $reason,
    ) {}
}
