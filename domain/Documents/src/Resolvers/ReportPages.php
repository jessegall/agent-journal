<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Mcp\Contracts\Continuations;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Records\Support\RecordIdentity;
use App\Text\Support\MarkdownText;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Enums\PublicationView;
use Domain\Documents\Mcp\PublicationChunks;
use Domain\Documents\Mcp\PublicationPages;
use Domain\Documents\Models\Report;
use Domain\Documents\Values\ReportReadCard;

final readonly class ReportPages implements ReportReader
{
    public const string TOOL = 'reports_read';

    private const string KEY = 'report_id';

    public function __construct(
        private Continuations $continuations,
        private PublicationChunks $chunks,
        private PublicationPages $pages,
    ) {}

    public function report(int|string $id, ToolArguments $arguments): ToolResult
    {
        $report = ReportRecords::published($id);
        $cursor = $arguments->continuation();

        $position = $cursor === null ? new Continuation(
            self::TOOL,
            (string) $id,
            ['view' => $arguments->enumOr('view', PublicationView::Summary)->value],
            1,
            revision: 1,
        ) : $this->continuations->open($cursor, self::TOOL, (string) $id);

        $card = new ReportReadCard($report->number, $report->id, $report->attention);

        $body = MarkdownText::body($report->body);

        return match (PublicationView::from($position->filters['view'])) {
            PublicationView::Summary => $this->pages->summary(
                $body,
                $report->abstract,
                $position,
                self::KEY,
                $card,
            ),
            PublicationView::Body => $this->chunks->page(
                $report->body,
                $cursor === null
                    ? $this->chunks->range($position, $body, $arguments)
                    : $position,
                self::KEY,
                $card->toArray(),
            ),
            PublicationView::Comments => $this->pages->comments(
                new RecordIdentity(Report::LINK_TYPE, $report->id),
                $position,
                self::KEY,
                $card,
            ),
            PublicationView::Revisions => throw ToolArgumentInvalid::for('view', 'summary, body, or comments'),
        };
    }
}
