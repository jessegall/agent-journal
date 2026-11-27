<?php

declare(strict_types=1);

namespace App\Hosts\Commands\TakeHostProcessSnapshot;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to send one full frame of a process's screen now. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class TakeHostProcessSnapshotCommand extends Command
{
    public function __construct(
        public string $processId,
        public HostInstructionSource $source,
    ) {}
}
