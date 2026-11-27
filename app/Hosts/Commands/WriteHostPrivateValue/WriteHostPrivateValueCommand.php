<?php

declare(strict_types=1);

namespace App\Hosts\Commands\WriteHostPrivateValue;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to write a private submission's value into a terminal process: the instruction names only the
 * submission, whose value the host pulls from the journal once. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class WriteHostPrivateValueCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $submissionId,
        public HostInstructionSource $source,
    ) {}
}
