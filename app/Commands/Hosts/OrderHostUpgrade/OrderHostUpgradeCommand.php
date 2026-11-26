<?php

declare(strict_types=1);

namespace App\Commands\Hosts\OrderHostUpgrade;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Orders a host whose processes all ended to install and switch to the release it waits on, with the signed manifest.
 * Run by the journal itself (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class OrderHostUpgradeCommand extends Command
{
    public function __construct(public string $hostId) {}
}
