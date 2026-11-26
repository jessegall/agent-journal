<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ForwardUserKeys;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders a user's keys typed into a terminal process at once, with no guard: the host raises the process's input
 * generation, so a guarded write of the journal made before it is refused. Run by a driver worker (internal, not
 * exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class ForwardUserKeysCommand extends Command
{
    public function __construct(
        public string $processId,
        public string $bytes,
        public HostOrderSource $source,
    ) {}
}
