<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ReportStoppedHandler;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * The host proved a claimed start's process exited, or that it made none; the start ends and its account's count
 * drops. A repeated report changes nothing.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(ReportStoppedHandler::class)]
final readonly class ReportStopped extends Command
{
    public function __construct(
        public string $hostId,
        public string $startKey,
    ) {}
}
