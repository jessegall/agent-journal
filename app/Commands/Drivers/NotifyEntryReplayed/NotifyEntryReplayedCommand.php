<?php

declare(strict_types=1);

namespace App\Commands\Drivers\NotifyEntryReplayed;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A host's report that its replay of a menu library entry worked on a runtime: the use is counted once per operation
 * key and the runtime's build listed. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyEntryReplayedCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $entryId,
        public string $runtimeId,
        public string $operationKey,
    ) {}
}
