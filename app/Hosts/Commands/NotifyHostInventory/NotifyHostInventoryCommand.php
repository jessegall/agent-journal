<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostInventory;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\Protocol\Data\HostInventoryData;
use App\Support\Command;

/**
 * A host that started reports what it holds, sent as its JSON body: its protocol, the newest order it answered and its processes. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyHostInventoryCommand extends Command
{
    public function __construct(
        public string $hostId,
        public HostInventoryData $inventory,
    ) {}
}
