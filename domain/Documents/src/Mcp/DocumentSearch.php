<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Agents\Values\ReadRequest;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Enums\AttentionFilter;

final readonly class DocumentSearch implements SearchContribution
{
    public function __construct(private DocumentResolver $documents) {}

    public function recordType(): string
    {
        return 'documents.document';
    }

    public function readRequest(): ReadRequest
    {
        return new ReadRequest('docs_read');
    }

    public function search(string $query, int $page): SearchPage
    {
        $matches = $this->documents->list(DocumentFilters::from([
            'attention' => AttentionFilter::All,
            'query' => $query,
            'page' => $page,
            'perPage' => self::PAGE_SIZE,
        ]));
        $hits = array_map(fn (PublicationCard $document) => SearchHit::matching(
            $this->recordType(),
            $document->id,
            $document->title,
            $document->title."\n".(is_string($document->snippet) ? $document->snippet : $document->abstract),
            $query,
        ), $matches->rows);

        return new SearchPage($hits, $matches->hasNextPage);
    }
}
