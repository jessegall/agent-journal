<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Handlers\DockReportHandler;

/**
 * Docks a report as a card in a running session; docking it again shows the same card.
 *
 * @implements Command<null>
 */
#[HandledBy(DockReportHandler::class)]
final readonly class DockReport implements Command
{
    public function __construct(public int $reportNumber, public string $sessionId) {}
}
