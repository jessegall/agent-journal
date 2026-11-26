<?php

declare(strict_types=1);

namespace App\Hosts\Commands\WriteHostInput;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to write bytes to a pipe process's standard input. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class WriteHostInputCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $bytes,
        public HostOrderSource $source,
    ) {}
}
