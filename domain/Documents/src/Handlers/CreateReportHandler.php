<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Records\Contracts\RecordLinker;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\LinkLimit;
use Domain\Documents\Support\MarkdownText;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CreateReportHandler
{
    public function __construct(
        private CurrentActor $actors,
        private Dispatcher $events,
        private RecordLinker $links,
    ) {}

    public function handle(CreateReport $command): CreatedRecord
    {
        $actor = $this->actors->actor();
        LinkLimit::require($command->about, CreateReport::MOST_LINKS);
        $report = Report::file(MarkdownText::title($command->title), MarkdownText::abstract($command->abstract), MarkdownText::body($command->body), $actor);
        $this->links->linkFrom($report, $command->about);
        $this->events->dispatch(new ReportFiled($report->id, $report->number, $actor));

        return new CreatedRecord($report->id, $report->number, 'report');
    }
}
