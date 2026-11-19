<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\MenuStaleReason;
use App\Agents\Handlers\MarkMenuEntryStaleHandler;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host's report that a library entry's replay failed a check on a build: the entry is stale on that build only and
 * kept. A repeated report changes nothing. Run for an authenticated host by the journal itself (internal, not
 * exported).
 *
 * @extends Command<null>
 */
#[HandledBy(MarkMenuEntryStaleHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class MarkMenuEntryStale extends Command
{
    /**
     * @param  list<string>  $rows
     */
    public function __construct(
        public string $hostId,
        public string $entryId,
        public string $runtimeId,
        public MenuStaleReason $reason,
        public int $step,
        public string $build,
        public array $rows,
    ) {}
}
