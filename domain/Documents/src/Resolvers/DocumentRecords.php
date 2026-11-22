<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Contracts\Records\RecordResolver;
use App\Support\TextSelection;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Support\RecordReading;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;

/**
 * The published documents, newest first, a page at a time, each with its current revision.
 */
#[Scoped]
final readonly class DocumentRecords implements DocumentResolver
{
    public function __construct(private DraftResolver $drafts, private RecordResolver $records) {}

    public function list(DocumentFilters $filters): PublicationList
    {
        $size = $filters->pageSize()->rows;
        $searched = $filters->revisions ? 'revisions' : 'currentRevision';
        $matching = fn (Builder|HasOneOrMany $revisions) => self::closedMatching($revisions, $filters->query);

        $documents = Document::query()->sharedPublished()->inAttention($filters->attention->state())
            ->with(
                [
                    'currentRevision' => fn (BelongsTo $revision) => $revision->when(
                        ! $filters->searches(),
                        fn (Builder $card) => $card->forCards(),
                    ),
                ],
            )
            ->when(
                $filters->searches() && $filters->revisions,
                fn (Builder $query) => $query->whereHas('revisions', $matching)->with(['revisions' => $matching]),
            )
            ->when(
                $filters->searches() && ! $filters->revisions,
                fn (Builder $query) => $query->whereIn(
                    'current_revision_id',
                    DocumentRevision::query()->whereNotNull('closed_at')->matchingText($filters->query)->select('id'),
                ),
            )
            ->when(
                $filters->after !== '',
                fn (Builder $query) => $query->where('id', '<', $filters->after),
                fn (Builder $query) => $query->offset(($filters->page - 1) * $size),
            )
            ->orderByDesc('id')
            ->limit($size + 1)
            ->get();

        $page = $documents->take($size);

        return PublicationList::from([
            'rows' => array_values(
                $page->map(
                    fn (Document $document) => $filters->searches() ? $document->searchResult(
                        $filters->query,
                        $document->foundRevision($searched),
                    ) : $document->card(),
                )->all(),
            ),
            'page' => $filters->page,
            'hasNextPage' => $documents->count() > $size,
            'next' => $documents->count() > $size ? $page->last()?->id : null,
        ]);
    }

    public function revisions(int $number, int $page): array
    {
        $document = self::published($number);

        return array_values($document->revisions()->whereNotNull('closed_at')->orderBy('number')->forPage(
            $page,
            50,
        )->get()
            ->map(fn (DocumentRevision $revision) => $revision->card())->all());
    }

    public function revision(int $documentNumber, int $revisionNumber): RevisionView
    {
        $document = self::published($documentNumber);

        $revision = $document->revisions()->whereNotNull('closed_at')->where(
            'number',
            $revisionNumber,
        )->firstOr(fn () => throw DocumentMissing::numbered($documentNumber));

        return $revision->view($document);
    }

    public function read(
        int $number,
        TextSelection $selection,
        int|null $revision = null,
        int|null $expectedRevision = null,
    ): RecordText {
        $document = self::published($number);
        $current = $document->currentRevisionOrFail()->number;

        if ($expectedRevision !== null && $expectedRevision !== $current) {
            throw StaleRead::revision($expectedRevision, $current);
        }

        $publishedRevision = $document->revisions()->whereNotNull('closed_at')->where(
            'number',
            $revision ?? $current,
        )->firstOr(fn () => throw DocumentMissing::numbered($number));

        return RecordReading::read("doc {$number}", $publishedRevision, $selection);
    }

    public function show(int $number): DocumentView
    {
        return self::published($number)->view();
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
        $document = self::published($number);

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
        $document = self::published($number);

        return $this->records->linkedCards($document);
    }

    /**
     * The published document with that number, with its current revision; refused when it is missing or hidden.
     *
     * @throws DocumentMissing
     */
    public static function published(int|string $reference): Document
    {
        $documents = Document::query()->sharedPublished()->with('currentRevision');

        if (is_int($reference)) {
            return $documents->where('number', $reference)->firstOr(
                fn () => throw DocumentMissing::numbered($reference),
            );
        }

        return $documents->whereKey($reference)->firstOr(fn () => throw DocumentMissing::identified($reference));
    }
}
