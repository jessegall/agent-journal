<?php

declare(strict_types=1);

namespace App\Agents\Commands\MarkMenuEntryStale;

use App\Agents\Enums\NavigationReason;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host's report that a library entry's replay failed a check on a build: the entry is stale on that build only and
 * kept. A repeated report changes nothing. Run for an authenticated host by the journal itself (internal, not
 * exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class MarkMenuEntryStaleCommand extends Command
{
    /**
     * @param  list<string>  $rows
     */
    public function __construct(
        public string $hostId,
        public string $entryId,
        public string $runtimeId,
        public NavigationReason $reason,
        public int $step,
        public string $build,
        public array $rows,
    ) {}
}
