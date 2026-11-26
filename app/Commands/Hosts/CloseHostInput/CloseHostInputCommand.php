<?php

declare(strict_types=1);

namespace App\Commands\Hosts\CloseHostInput;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to close a pipe process's standard input, so a driver that reads it to its end goes on. Run by a
 * driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class CloseHostInputCommand extends Command
{
    public function __construct(
        public string $processId,
        public HostOrderSource $source,
    ) {}
}
