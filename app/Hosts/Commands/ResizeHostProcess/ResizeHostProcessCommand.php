<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ResizeHostProcess;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to give a process's terminal a new size. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class ResizeHostProcessCommand extends Command
{
    public function __construct(
        public string $processId,
        public int $columns,
        public int $rows,
        public HostInstructionSource $source,
    ) {}
}
