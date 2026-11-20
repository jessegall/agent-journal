<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Contracts\CommandHandler;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Commands\CommentOnReport;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordComments;

final readonly class CommentOnReportHandler implements CommandHandler
{
    public function __construct(private RecordComments $comments) {}

    public function handle(CommentOnReport $command): string
    {
        return $this->comments->post(
            new RecordIdentity(Report::LINK_TYPE, $command->reportId),
            $command->body,
            CommentOnReport::class,
        );
    }
}
