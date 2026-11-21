<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Support\ScreenReportAnswer;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Keeps a host's frame of a watched runtime's screen, sent as its JSON body, as that runtime's latest. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ScreenReportAnswer>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRuntimeScreen extends Command
{
    public function __construct(
        public string $hostId,
        public string $body,
    ) {}
}
