<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\CleanupState;
use App\Agents\Handlers\ReportCleanupHandler;
use App\Agents\Values\CleanupReport;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host reports one pass of an ended launch's cleanup: what it removed or found gone, the dirty workspace it kept
 * and why a deletion failed. The result is where the cleanup stands. A repeated report changes nothing more.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<CleanupState>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(ReportCleanupHandler::class)]
final readonly class ReportCleanup extends Command
{
    public function __construct(
        public string $hostId,
        public string $sessionId,
        public CleanupReport $report,
    ) {}
}
