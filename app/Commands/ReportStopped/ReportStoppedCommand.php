<?php

declare(strict_types=1);

namespace App\Commands\ReportStopped;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * The host proved a claimed start's process exited, or that it made none; the start ends and its account's count
 * drops. A repeated report changes nothing.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportStoppedCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $startKey,
    ) {}
}
