<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StopHostProcess;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to stop a process: it gets the grace time to end, then the force time before it is killed. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class StopHostProcessCommand extends Command
{
    public function __construct(
        public string $processId,
        public int $graceMs,
        public int $forceMs,
        public HostOrderSource $source,
    ) {}
}
