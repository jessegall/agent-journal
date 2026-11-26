<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartSwitchReplacement;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Starts the session that replaces a switch's proven-stopped one, through the main start's own admission.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class StartSwitchReplacementCommand extends Command
{
    public function __construct(public string $switchId) {}
}
