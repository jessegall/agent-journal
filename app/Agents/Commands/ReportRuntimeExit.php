<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Ends a runtime's session on the host's verified report that its program exited. Run for an authenticated host by the
 * journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRuntimeExit extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public int $processGeneration,
        public string $evidence,
    ) {}
}
