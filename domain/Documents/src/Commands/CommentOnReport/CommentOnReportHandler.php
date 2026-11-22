<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CommentOnReport;

use App\Numbers\Support\RecordReference;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Commands\Support\DocumentCommandHandler;
use Domain\Documents\Models\Report;
use Domain\Documents\Resolvers\ReportRecords;
use Domain\Documents\Support\RecordComments;

final readonly class CommentOnReportHandler extends DocumentCommandHandler
{
    public function __construct(private RecordComments $comments) {}

    public function handle(CommentOnReportCommand $command): string
    {
        $reference = RecordReference::idOrNumber($command->reportId);
        $id = is_int($reference) ? ReportRecords::published($reference)->id : $reference;

        return $this->comments->post(
            new RecordIdentity(Report::LINK_TYPE, $id),
            $command->body,
            CommentOnReportCommand::class,
        );
    }
}
