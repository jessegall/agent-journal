<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SignalHostProcess;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to send a signal to a process, such as SIGINT to end a turn. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class SignalHostProcessCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $signal,
        public HostInstructionSource $source,
    ) {}
}
