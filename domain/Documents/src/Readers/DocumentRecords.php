<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Illuminate\Container\Attributes\Scoped;

/**
 * The published documents, newest first, a page at a time, each with its current revision.
 */
#[Scoped]
final readonly class DocumentRecords implements DocumentReader
{
    public function list(DocumentFilters $filters): DocumentList
    {
        $size = $filters->pageSize()->rows;
        $documents = Document::query()->sharedPublished()->inAttention($filters->attention->state())
            ->with('currentRevision')
            ->forPage($filters->page, $size)
            ->limit($size + 1)
            ->get();

        return DocumentList::from([
            'rows' => array_values($documents->take($size)->map(fn (Document $document) => $document->card())->all()),
            'page' => $filters->page,
            'hasNextPage' => $documents->count() > $size,
        ]);
    }

    public function revisions(int $documentNumber, int $page): array
    {
        $document = Document::query()->sharedPublished()->where('number', $documentNumber)->first() ?? throw DocumentMissing::numbered($documentNumber);

        return array_values($document->revisions()->whereNotNull('closed_at')->orderBy('number')->forPage($page, 50)->get()
            ->map(fn (DocumentRevision $revision) => $revision->card())->all());
    }

    public function revision(int $documentNumber, int $revisionNumber): RevisionView
    {
        $document = Document::query()->sharedPublished()->with('currentRevision')->where('number', $documentNumber)->first() ?? throw DocumentMissing::numbered($documentNumber);
        $revision = $document->revisions()->whereNotNull('closed_at')->where('number', $revisionNumber)->first() ?? throw DocumentMissing::numbered($documentNumber);

        return $revision->view($document);
    }

    public function show(int $number): DocumentView
    {
        $document = Document::query()->sharedPublished()->with('currentRevision')->where('number', $number)->first();

        return $document?->view() ?? throw DocumentMissing::numbered($number);
    }
}
