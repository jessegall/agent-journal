<?php

declare(strict_types=1);

namespace App\Commands\Hosts\SnapshotHostProcess;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to send one full frame of a process's screen now. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class SnapshotHostProcessCommand extends Command
{
    public function __construct(
        public string $processId,
        public HostOrderSource $source,
    ) {}
}
