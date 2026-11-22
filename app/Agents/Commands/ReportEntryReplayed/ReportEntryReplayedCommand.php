<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReportEntryReplayed;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host's report that its replay of a menu library entry worked on a runtime: the use is counted once per operation
 * key and the runtime's build listed. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportEntryReplayedCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $entryId,
        public string $runtimeId,
        public string $operationKey,
    ) {}
}
