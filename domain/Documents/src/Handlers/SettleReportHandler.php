<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Commands\SettleReport;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordFields;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class SettleReportHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private Dispatcher $events) {}

    public function handle(SettleReport $command): void
    {
        $reason = RecordFields::settlementReason($command->reason);
        $report = Report::query()->where('number', $command->reportNumber)->lockForUpdate()->first() ?? throw ReportMissing::numbered($command->reportNumber);

        if ($report->settle($this->actors->actor(), $reason, null)) {
            $this->events->dispatch(new RecordSettled(Report::LINK_TYPE, $report->id));
        }
    }
}
