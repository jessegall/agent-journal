<?php

declare(strict_types=1);

namespace App\Commands\Hosts\MarkFailedUpgrades;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Fails each upgrade whose order the host answered done but whose inventory has not named the new release in time.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class MarkFailedUpgradesCommand extends Command {}
