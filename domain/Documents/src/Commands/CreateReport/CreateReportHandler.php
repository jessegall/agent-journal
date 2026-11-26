<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CreateReport;

use App\Records\Contracts\RecordLinker;
use App\Sessions\Contracts\SessionProvenance;
use App\Support\MarkdownText;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\DocumentBody;
use Domain\Documents\Values\CreatedRecord;

final readonly class CreateReportHandler extends DocumentCommandHandler
{
    public function __construct(
        private RecordLinker $links,
        private SessionProvenance $provenance,
        private DocumentBody $bodies,
    ) {}

    public function handle(CreateReportCommand $command): CreatedRecord
    {
        $actor = $command->dispatchedBy();
        $body = $this->bodies->read($command->body, $command->uploadId, UploadType::ReportBody);

        $report = Report::create(
            $command->title,
            $command->abstract,
            MarkdownText::body($body),
            $actor,
            $command->owner(),
        );

        $this->provenance->record($report);
        $this->links->linkFrom($report, $command->relatedRecords);

        return new CreatedRecord($report->id, $report->number, 'report');
    }
}
