<?php

declare(strict_types=1);

namespace App\Commands\Drivers\FailDriverSwitchStart;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
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
