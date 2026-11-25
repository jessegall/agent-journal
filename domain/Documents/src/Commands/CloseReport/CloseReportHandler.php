<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CloseReport;

use App\Support\RecordReference;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordChanges;
use Domain\Documents\Support\RecordSettlementService;

final readonly class CloseReportHandler extends DocumentCommandHandler
{
    public function __construct(private RecordChanges $changes, private RecordSettlementService $settling) {}

    public function handle(CloseReportCommand $command): void
    {
        $report = Report::findLockedForClosing(RecordReference::idOrNumber($command->reportReference));

        $this->changes->requireChangeOf($report);

        $this->settling->settle($report, $command->dispatchedBy(), $command->reason, null);
    }
}
