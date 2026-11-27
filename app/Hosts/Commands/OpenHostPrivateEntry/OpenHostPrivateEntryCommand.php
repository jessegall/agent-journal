<?php

declare(strict_types=1);

namespace App\Hosts\Commands\OpenHostPrivateEntry;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\HostInstructionSource;

/**
 * Instructs the host to stop every frame and recording of a terminal process from leaving, so a private
 * value can be typed into it. Run by a driver worker (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenHostPrivateEntryCommand extends Command
{
    public function __construct(
        public string $processId,
        public HostInstructionSource $source,
    ) {}
}
