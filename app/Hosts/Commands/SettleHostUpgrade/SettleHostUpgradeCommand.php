<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SettleHostUpgrade;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Settles a host's answer to its upgrade instruction: a refusal fails the upgrade with the host's reason, and a done answer
 * waits for the inventory of the new release. Run by the journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class SettleHostUpgradeCommand extends Command
{
    public function __construct(public string $instructionId) {}
}
