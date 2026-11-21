<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Starts the session that replaces a switch's proven-stopped one, through the main start's own admission.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class StartSwitchReplacement extends Command
{
    public function __construct(public string $switchId) {}
}
