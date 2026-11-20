<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Numbers\Support\RecordReference;
use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Commands\CloseReport;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordChanges;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CloseReportHandler extends DocumentCommandHandler
{
    public function __construct(private RecordChanges $changes, private Dispatcher $events) {}

    public function handle(CloseReport $command): void
    {
        $report = Report::lockedForClosing(RecordReference::idOrNumber($command->reportReference));

        $this->changes->requireChangeOf($report);

        if ($report->settle($command->dispatchedBy(), $command->reason, null)) {
            $this->events->dispatch(new RecordSettled(Report::LINK_TYPE, $report->id));
        }
    }
}
