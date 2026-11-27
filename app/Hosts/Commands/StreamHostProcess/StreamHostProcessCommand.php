<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StreamHostProcess;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to send a process's screen so many times a second, changed or not; 0 ends the stream. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class StreamHostProcessCommand extends Command
{
    public function __construct(
        public string $processId,
        public int $framesPerSecond,
        public bool $isRaw,
        public HostInstructionSource $source,
    ) {}
}
