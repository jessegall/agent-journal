<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Documents\Handlers\SettleReportHandler;

/**
 * Settles a report with the reason it needs no more attention.
 *
 * @implements Command<null>
 */
#[HandledBy(SettleReportHandler::class)]
final readonly class SettleReport implements Command
{
    public function __construct(
        public int $reportNumber,
        public string $reason,
    ) {}
}
