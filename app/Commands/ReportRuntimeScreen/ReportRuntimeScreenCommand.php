<?php

declare(strict_types=1);

namespace App\Commands\ReportRuntimeScreen;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Support\ScreenReportAnswer;

/**
 * Keeps a host's frame of a watched runtime's screen, sent as its JSON body, as that runtime's latest. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ScreenReportAnswer>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRuntimeScreenCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $body,
    ) {}
}
