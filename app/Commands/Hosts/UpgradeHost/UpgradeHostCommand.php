<?php

declare(strict_types=1);

namespace App\Commands\Hosts\UpgradeHost;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Moves a connected host to the release the journal publishes: every process on it is stopped first, and the upgrade
 * is ordered once the last one ended.
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class UpgradeHostCommand extends Command
{
    public function __construct(public string $hostId, public string $release) {}
}
