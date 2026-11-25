<?php

declare(strict_types=1);

namespace App\Commands\Sessions\NotifyCleanup;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Sessions\CleanupState;
use App\Support\Command;
use App\Values\CleanupReport;

/**
 * A host reports one pass of an ended launch's cleanup: what it removed or found gone, the dirty workspace it kept
 * and why a deletion failed. The result is where the cleanup stands. A repeated report changes nothing more.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<CleanupState>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyCleanupCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $sessionId,
        public CleanupReport $report,
    ) {}
}
