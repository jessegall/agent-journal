<?php

declare(strict_types=1);

namespace App\Hosts\Commands\InstructHostUpgrade;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Instructs a host whose processes all ended to install and switch to the release it waits on, with the signed manifest.
 * Run by the journal itself (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InstructHostUpgradeCommand extends Command
{
    public function __construct(public string $hostId) {}
}
