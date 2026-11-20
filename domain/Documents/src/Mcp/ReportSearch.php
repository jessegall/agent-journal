<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Agents\Values\ReadRequest;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\ReportCard;
use Domain\Documents\Enums\AttentionFilter;

final readonly class ReportSearch implements SearchContribution
{
    public function __construct(private ReportResolver $reports) {}

    public function recordType(): string
    {
        return 'documents.report';
    }

    public function readRequest(): ReadRequest
    {
        return new ReadRequest('reports_read', ResourceAreaType::JournalContent);
    }

    public function search(string $query, int $page): SearchPage
    {
        $matches = $this->reports->list(DocumentFilters::from([
            'attention' => AttentionFilter::All,
            'query' => $query,
            'page' => $page,
            'perPage' => self::PAGE_SIZE,
        ]));
        $hits = array_map(fn (ReportCard $report) => SearchHit::matching(
            $this->recordType(),
            $report->id,
            $report->title,
            $report->title."\n".(is_string($report->snippet) ? $report->snippet : $report->abstract),
            $query,
        ), $matches->rows);

        return new SearchPage($hits, $matches->hasNextPage);
    }
}
