<?php

declare(strict_types=1);

namespace App\Commands\Hosts\WriteHostPrivateValue;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to write a private submission's value into a terminal process: the order names only the
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
        public HostOrderSource $source,
    ) {}
}
