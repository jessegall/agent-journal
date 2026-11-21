<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\FailDriverSwitchLaunchHandler;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Records that the replacement of a switch was refused, with its reason; the agent stays idle with its history.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(FailDriverSwitchLaunchHandler::class)]
final readonly class FailDriverSwitchLaunch extends Command
{
    public function __construct(
        public string $switchId,
        public string $reason,
    ) {}
}
