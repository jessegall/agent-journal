<?php

declare(strict_types=1);

namespace App\Commands\Hosts\OpenHostPrivateEntry;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\HostOrderSource;

/**
 * Orders the host to stop every frame and recording of a terminal process from leaving, so a private
 * value can be typed into it. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenHostPrivateEntryCommand extends Command
{
    public function __construct(
        public string $processId,
        public HostOrderSource $source,
    ) {}
}
