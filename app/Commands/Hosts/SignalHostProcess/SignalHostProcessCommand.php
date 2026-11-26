<?php

declare(strict_types=1);

namespace App\Commands\Hosts\SignalHostProcess;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to send a signal to a process, such as SIGINT to end a turn. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class SignalHostProcessCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $signal,
        public HostOrderSource $source,
    ) {}
}
