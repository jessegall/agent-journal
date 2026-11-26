<?php

declare(strict_types=1);

namespace App\Commands\Hosts\CloseHostPrivateEntry;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to let a terminal process's frames leave again once its screen redrew after a private
 * entry. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class CloseHostPrivateEntryCommand extends Command
{
    public function __construct(
        public string $processId,
        public HostOrderSource $source,
    ) {}
}
