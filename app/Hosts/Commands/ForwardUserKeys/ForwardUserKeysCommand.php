<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ForwardUserKeys;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to type a user's keys into a terminal process at once, with no guard: the host raises the
 * process's input generation, so a guarded write of the journal made before it is refused. Run by a driver worker
 * (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class ForwardUserKeysCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $bytes,
        public HostInstructionSource $source,
    ) {}
}
