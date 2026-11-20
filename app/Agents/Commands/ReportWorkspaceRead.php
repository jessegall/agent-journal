<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ReportWorkspaceReadHandler;
use App\Agents\Values\WorkspaceReadReference;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host answers a retained workspace read with the one sample it took of the actor's checkout, timed when the journal
 * records it; a repeated answer changes nothing.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(ReportWorkspaceReadHandler::class)]
final readonly class ReportWorkspaceRead extends Command
{
    public function __construct(
        public string $hostId,
        public WorkspaceReadReference $reference,
        public bool $isAvailable,
        public bool $isDirty,
        public bool $isClean,
        public int $generation,
    ) {}
}
