<?php

declare(strict_types=1);

namespace Domain\Documents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use Domain\Documents\Api\Events\RecordCommented;
use Domain\Documents\Commands\CommentReport;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\RecordComment;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\MarkdownText;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CommentReportHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private Dispatcher $events) {}

    public function handle(CommentReport $command): void
    {
        $report = Report::query()->where('number', $command->reportNumber)->first() ?? throw ReportMissing::numbered($command->reportNumber);
        $body = MarkdownText::comment($command->body);
        $command->anchor?->requireQuoteIn($report->body);

        $comment = RecordComment::post(Report::LINK_TYPE, $report->id, $this->actors->actor(), $body, $command->anchor);
        $this->events->dispatch(new RecordCommented($comment->id, Report::LINK_TYPE, $report->id));
    }
}
