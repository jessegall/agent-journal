<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CloseReport;

use App\Numbers\Support\RecordReference;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordChanges;
use Domain\Documents\Support\RecordSettling;

final readonly class CloseReportHandler extends DocumentCommandHandler
{
    public function __construct(private RecordChanges $changes, private RecordSettling $settling) {}

    public function handle(CloseReportCommand $command): void
    {
        $report = Report::lockedForClosing(RecordReference::idOrNumber($command->reportReference));

        $this->changes->requireChangeOf($report);

        $this->settling->settle($report, $command->dispatchedBy(), $command->reason, null);
    }
}
