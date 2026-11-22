<?php

declare(strict_types=1);

namespace App\Commands\ReportCleanup;

use App\Attributes\Entry;
use App\Enums\CleanupState;
use App\Enums\CommandEntry;
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
final readonly class ReportCleanupCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $sessionId,
        public CleanupReport $report,
    ) {}
}
