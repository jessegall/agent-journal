<?php

declare(strict_types=1);

namespace App\Commands\ReportWorkspaceRead;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\CommitObservation;
use App\Values\WorkspaceReadReference;

/**
 * A host answers a retained workspace read with the one sample it took of the actor's checkout, timed when the journal
 * records it; a repeated answer changes nothing.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportWorkspaceReadCommand extends Command
{
    public function __construct(
        public string $hostId,
        public WorkspaceReadReference $reference,
        public bool $isAvailable,
        public bool $isDirty,
        public bool $isClean,
        public int $generation,
        public CommitObservation $commit,
    ) {}
}
