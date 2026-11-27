<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SendHostKeys;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;
use App\Values\RowGuard;

/**
 * Instructs the host to type keys into a process's terminal, only while the rows they are meant for and the input generation are as the journal saw them; the instruction lapses after five seconds. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class SendHostKeysCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $bytes,
        public RowGuard $rows,
        public int $inputGeneration,
        public HostInstructionSource $source,
    ) {}
}
