<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostProcess;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\Protocol\Payloads\HostProcessReportPayload;
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
        public HostProcessReportPayload $report,
    ) {}
}
