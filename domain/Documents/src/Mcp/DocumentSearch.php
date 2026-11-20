<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Agents\Values\ReadRequest;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Data\DocumentCard;

final readonly class DocumentSearch implements SearchContribution
{
    public function __construct(private DocumentReader $documents) {}

    public function recordType(): string
    {
        return 'documents.document';
    }

    public function readRequest(): ReadRequest
    {
        return new ReadRequest('docs_read', ResourceAreaType::JournalContent);
    }

    public function search(string $query, int $page): SearchPage
    {
        $matches = $this->documents->list($query, $page, self::PAGE_SIZE);
        $hits = array_map(fn (DocumentCard $doc): SearchHit => SearchHit::matching(
            $this->recordType(),
            $doc->id,
            $doc->title,
            $doc->title."\n".(is_string($doc->snippet) ? $doc->snippet : $doc->abstract),
            $query,
        ), $matches->rows);

        return new SearchPage($hits, $matches->hasNextPage);
    }
}
