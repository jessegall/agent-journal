<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\SummaryProvider;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Records\Values\SummaryPage;
use App\Values\ProjectOwner;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;

/**
 * Published documents as a short card shows them: the current title, the revision and where the document stands, with
 * its page. One is read by its id, a batch in one query with their current revisions.
 */
final readonly class DocumentSummaries implements SummaryProvider
{
    public function requireReadable(string $id): RecordSummary
    {
        $document = Document::query()
            ->sharedPublished()
            ->whereKey($id)
            ->firstOr(RecordUnavailable::throwing()->forModel(Document::class, $id));

        return self::summary($document);
    }

    public function ownerOf(string $id): ProjectOwner
    {
        return Document::query()
            ->whereKey($id)
            ->firstOr(RecordUnavailable::throwing()->forModel(Document::class, $id))
            ->projectOwner();
    }

    public function visibleSummaries(array $ids): array
    {
        $documents = Document::query()
            ->sharedPublished()
            ->withCurrentRevision()
            ->whereKey($ids)
            ->readExactlyOf($ids)
            ->get();

        return array_values($documents->map(self::summary(...))->all());
    }

    private static function summary(Document $document): RecordSummary
    {
        $revision = DocumentRevision::findCurrentOf($document);

        return new RecordSummary(
            $document->id,
            $revision->title,
            $document->attention->standing(),
            [new SummaryLine('revision', "revision {$revision->number}")],
            page: new SummaryPage('documents.document', 'document', (string) $document->number),
        );
    }
}
