<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RenewHostWorker;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A worker renews its lease of a process; a worker that was replaced is refused. Run by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RenewHostWorkerCommand extends Command
{
    public function __construct(
        public string $processId,
        public int $workerGeneration,
    ) {}
}
