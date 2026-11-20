<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Agents\Support\SessionProvenance;
use App\Contracts\CommandHandler;
use App\Records\Contracts\RecordLinker;
use App\Text\Support\MarkdownText;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Models\Report;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CreateReportHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private RecordLinker $links,
        private SessionProvenance $provenance,
    ) {}

    public function handle(CreateReport $command): CreatedRecord
    {
        $actor = $command->dispatchedBy();
        $report = Report::file($command->title, $command->abstract, MarkdownText::body($command->body), $actor);
        $this->provenance->record($report);
        $this->links->linkFrom($report, $command->about);
        $this->events->dispatch(new ReportFiled($report->id, $report->number, $actor));

        return new CreatedRecord($report->id, $report->number, 'report');
    }
}
