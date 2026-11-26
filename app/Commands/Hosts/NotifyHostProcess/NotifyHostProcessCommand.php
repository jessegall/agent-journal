<?php

declare(strict_types=1);

namespace App\Commands\Hosts\NotifyHostProcess;

use App\Attributes\Commands\Entry;
use App\Data\Hosts\HostProcessReportData;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A host reports a change of one of its processes: it runs, it was healed and runs again, it exited or it was lost.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyHostProcessCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $processId,
        public HostProcessReportData $report,
    ) {}
}
