<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Agents\Contracts\SessionProvenance;
use App\Records\Contracts\RecordLinker;
use App\Text\Support\MarkdownText;
use Domain\Documents\Api\CreatedRecord;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Handlers\Support\DocumentCommandHandler;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\DocumentBody;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CreateReportHandler extends DocumentCommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private RecordLinker $links,
        private SessionProvenance $provenance,
        private DocumentBody $bodies,
    ) {}

    public function handle(CreateReport $command): CreatedRecord
    {
        $actor = $command->dispatchedBy();
        $body = $this->bodies->read($command->body, $command->uploadId, UploadType::ReportBody);
        $report = Report::create($command->title, $command->abstract, MarkdownText::body($body), $actor);
        $this->provenance->record($report);
        $this->links->linkFrom($report, $command->relatedRecords);
        $this->events->dispatch(new ReportFiled($report->id, $report->number, $actor));

        return new CreatedRecord($report->id, $report->number, 'report');
    }
}
