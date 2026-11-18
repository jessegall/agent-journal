<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Records\Contracts\RecordReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\RecordComment;
use Domain\Documents\Support\RecordReading;
use Domain\Documents\Support\TextSelection;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;

/**
 * The published documents, newest first, a page at a time, each with its current revision.
 */
#[Scoped]
final readonly class DocumentRecords implements DocumentReader
{
    public function __construct(private DraftReader $drafts, private RecordReader $records) {}

    public function list(DocumentFilters $filters): DocumentList
    {
        $size = $filters->pageSize()->rows;
        $searched = $filters->revisions ? 'revisions' : 'currentRevision';
        $matching = fn (Builder|HasOneOrMany $revisions) => self::closedMatching($revisions, $filters->query);
        $documents = Document::query()->sharedPublished()->inAttention($filters->attention->state())
            ->with('currentRevision')
            ->when($filters->searches() && $filters->revisions, fn (Builder $query) => $query->whereHas('revisions', $matching)->with(['revisions' => $matching]))
            ->when($filters->searches() && ! $filters->revisions, fn (Builder $query) => $query->whereIn('current_revision_id', DocumentRevision::query()->whereNotNull('closed_at')->matchingText($filters->query)->select('id')))
            ->when($filters->after !== '', fn (Builder $query) => $query->where('id', '<', $filters->after), fn (Builder $query) => $query->offset(($filters->page - 1) * $size))
            ->orderByDesc('id')
            ->limit($size + 1)
            ->get();
        $page = $documents->take($size);

        return DocumentList::from([
            'rows' => array_values($page->map(fn (Document $document) => $filters->searches() ? $document->hit($filters->query, $document->foundRevision($searched)) : $document->card())->all()),
            'page' => $filters->page,
            'hasNextPage' => $documents->count() > $size,
            'next' => $documents->count() > $size ? $page->last()?->id : null,
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

    public function read(int $number, TextSelection $selection, int|null $revision = null, int|null $expectedRevision = null): RecordText
    {
        $document = Document::query()->sharedPublished()->with('currentRevision')->where('number', $number)->first() ?? throw DocumentMissing::numbered($number);
        $current = $document->currentRevisionOrFail()->number;

        if ($expectedRevision !== null && $expectedRevision !== $current) {
            throw StaleRead::revision($expectedRevision, $current);
        }

        $read = $document->revisions()->whereNotNull('closed_at')->where('number', $revision ?? $current)->first() ?? throw DocumentMissing::numbered($number);

        return RecordReading::read("doc {$number}", $read, $selection);
    }

    public function show(int $number): DocumentView
    {
        $document = Document::query()->sharedPublished()->with('currentRevision')->where('number', $number)->first();

        return $document?->view() ?? throw DocumentMissing::numbered($number);
    }

    public function comments(int $number, int $page): array
    {
        $record = Document::query()->sharedPublished()->where('number', $number)->first() ?? throw DocumentMissing::numbered($number);

        return array_values(RecordComment::query()->onRecord(Document::LINK_TYPE, $record->id)->forPage(max(1, $page), 50)->get()
            ->map(fn (RecordComment $comment) => $comment->card())->all());
    }

    /**
     * Only the closed revisions whose text holds the words.
     *
     * @param  Builder<DocumentRevision>|HasOneOrMany<DocumentRevision, Document, mixed>  $revisions
     */
    private static function closedMatching(Builder|HasOneOrMany $revisions, string $words): void
    {
        $revisions->whereNotNull('closed_at')->matchingText($words);
    }

    public function inspect(int $number): RecordInspection
    {
        $document = Document::query()->sharedPublished()->where('number', $number)->first() ?? throw DocumentMissing::numbered($number);

        return RecordInspection::from([
            'label' => "doc {$number}",
            'attention' => $document->attention,
            'editing' => $this->drafts->stateOf($number),
            'settlements' => $document->settlements(),
            'closes' => $document->closes(),
            'links' => $this->records->linkedCards($document),
        ]);
    }

    public function links(int $number): array
    {
        $document = Document::query()->sharedPublished()->where('number', $number)->first() ?? throw DocumentMissing::numbered($number);

        return $this->records->linkedCards($document);
    }
}
