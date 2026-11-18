<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Handlers\HideReportDockHandler;

/**
 * Hides a report's card in a session; the report and its links stay.
 *
 * @implements Command<null>
 */
#[HandledBy(HideReportDockHandler::class)]
final readonly class HideReportDock implements Command
{
    public function __construct(public int $reportNumber, public string $sessionId) {}
}
