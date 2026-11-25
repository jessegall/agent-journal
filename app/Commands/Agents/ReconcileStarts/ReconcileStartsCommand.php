<?php

declare(strict_types=1);

namespace App\Commands\Agents\ReconcileStarts;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A host reports the process starts whose exit it proved, by their start keys, after a restart or as they end. A
 * start the host does not name stays unresolved: a missing process id never ends one. The result is how many
 * accounts the ended starts used.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReconcileStartsCommand extends Command
{
    /**
     * @param  list<string>  $stoppedStartKeys
     */
    public function __construct(
        public string $hostId,
        public array $stoppedStartKeys,
    ) {}
}
