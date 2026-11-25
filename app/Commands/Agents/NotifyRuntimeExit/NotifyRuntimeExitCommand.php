<?php

declare(strict_types=1);

namespace App\Commands\Agents\NotifyRuntimeExit;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Ends a runtime's session on the host's verified report that its driver exited. Run for an authenticated host by the
 * journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyRuntimeExitCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
