<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\RecordOwnTerminal;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Records the terminal a binding's host will run in its owner's installation.
 *
 * @extends Command<RecordedOwnTerminal>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordOwnTerminalCommand extends Command
{
    public function __construct(public string $runtimeId) {}
}
