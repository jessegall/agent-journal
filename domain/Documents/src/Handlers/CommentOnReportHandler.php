<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Commands\CommentOnReport;
use Domain\Documents\Models\Report;
use Domain\Documents\Resolvers\ReportRecords;
use Domain\Documents\Support\RecordComments;

final readonly class CommentOnReportHandler implements CommandHandler
{
    public function __construct(private RecordComments $comments) {}

    public function handle(CommentOnReport $command): string
    {
        $id = is_int($command->reportId) ? ReportRecords::published($command->reportId)->id : $command->reportId;

        return $this->comments->post(
            new RecordIdentity(Report::LINK_TYPE, $id),
            $command->body,
            CommentOnReport::class,
        );
    }
}
