<?php

declare(strict_types=1);

namespace App\Hosts\Commands\CloseHostPrivateEntry;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to let a terminal process's frames leave again once its screen redrew after a private
 * entry. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class CloseHostPrivateEntryCommand extends Command
{
    public function __construct(
        public string $processId,
        public HostInstructionSource $source,
    ) {}
}
