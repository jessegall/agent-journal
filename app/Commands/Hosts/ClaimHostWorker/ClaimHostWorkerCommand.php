<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimHostWorker;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * A worker takes over a process: the worker before it is fenced from now on, and it answers its generation. Run by a driver worker (internal, not exported).
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class ClaimHostWorkerCommand extends Command
{
    public function __construct(
        public string $processId,
    ) {}
}
