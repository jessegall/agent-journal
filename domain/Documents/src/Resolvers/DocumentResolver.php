<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Records\Contracts\RecordResolver;
use App\Support\Layout\LayoutRowData;
use App\Support\TextSelection;
use Domain\Documents\Contracts\Documents\DocumentResolver as DocumentResolverContract;
use Domain\Documents\Contracts\Drafts\DraftResolver;
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
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;

/**
 * The published documents, newest first, a page at a time, each with its current revision.
 */
#[Scoped]
final readonly class DocumentResolver implements DocumentResolverContract
{
    public function __construct(private DraftResolver $drafts, private RecordResolver $records) {}

    public function list(DocumentFilters $filters): PublicationList
    {
        $size = $filters->pageSize()->rows;
        $searched = $filters->revisions ? 'revisions' : 'currentRevision';
        $words = $filters->searchWords();
        $matching = fn (Builder|HasOneOrMany $revisions) => self::closedMatching($revisions, $words->get());

        $documents = $this->matching($filters)
            ->when(
                $filters->searches(),
                fn (Builder $query) => $query->withCurrentRevision(),
                fn (Builder $query) => $query->withCurrentRevisionCard(),
            )
            ->when(
                $filters->searches() && $filters->revisions,
                fn (Builder $query) => $query->with(['revisions' => $matching]),
            )
            ->when(
                $filters->after !== null,
                fn (Builder $query) => $query->where('id', '<', $filters->after),
                fn (Builder $query) => $query->offset(($filters->page - 1) * $size),
            )
            ->newestFirst()
            ->limit($size + 1)
            ->get();

        $page = $documents->take($size);

        return PublicationList::from([
            'rows' => array_values(
                $page->map(
                    fn (Document $document) => $filters->searches()
                        ? $document->searchResult($words->get(), $searched)
                        : $document->card,
                )->all(),
            ),
            'page' => $filters->page,
            'hasNextPage' => $documents->count() > $size,
            'next' => $documents->count() > $size ? $page->last()?->id : null,
        ]);
    }

    /** @return list<LayoutRowData> */
    public function preview(DocumentFilters $filters, int $limit): array
    {
        $records = $this->matching($filters)
            ->newestFirst()
            ->limit($limit)
            ->with('currentRevision:id,title')
            ->get(['id', 'number', 'current_revision_id']);

        return $records->map(fn (Document $record) => LayoutRowData::build()
            ->key($record->id)
            ->label($record->currentRevision->title)
            ->value('Document')
            ->href(route('documents.document', ['document' => $record->number], false))
            ->finish())->values()->all();
    }

    /** @return Builder<Document> */
    private function matching(DocumentFilters $filters): Builder
    {
        $words = $filters->searchWords();
        $matching = fn (Builder|HasOneOrMany $revisions) => self::closedMatching($revisions, $words->get());

        return Document::query()->sharedPublished()->inAttention($filters->attention->state())
            ->when(
                $filters->searches() && $filters->revisions,
                fn (Builder $query) => $query->whereHas('revisions', $matching),
            )
            ->when(
                $filters->searches() && ! $filters->revisions,
                fn (Builder $query) => $query->whereIn(
                    'current_revision_id',
                    DocumentRevision::query()->closed()->matchingText($words->get())->keys(),
                ),
            );
    }

    public function revisions(int $number, int $page): array
    {
        $document = self::published($number);

        return array_values($document->revisions()->closed()->byNumber()->forPage(
            $page,
            50,
        )->get()
            ->map(fn (DocumentRevision $revision) => $revision->card)->all());
    }

    public function revision(int $documentNumber, int $revisionNumber): RevisionView
    {
        $document = self::published($documentNumber);

        $revision = $document->revisions()->closed()->numbered($revisionNumber)->firstOr(
            DocumentMissing::throwing()->numbered($documentNumber),
        );

        return $revision->view($document);
    }

    public function read(
        int $number,
        TextSelection $selection,
        int|null $revision = null,
        int|null $expectedRevision = null,
    ): RecordText {
        $document = self::published($number);
        $current = DocumentRevision::findCurrentOf($document)->number;

        if ($expectedRevision !== null && $expectedRevision !== $current) {
            throw StaleRead::revision($expectedRevision, $current);
        }

        $publishedRevision = $document->revisions()->closed()->numbered($revision ?? $current)->firstOr(
            DocumentMissing::throwing()->numbered($number),
        );

        return RecordReading::read("doc {$number}", $publishedRevision, $selection);
    }

    public function show(int $number): DocumentView
    {
        return self::published($number)->view;
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
        $documents = Document::query()->sharedPublished()->withCurrentRevision();

        if (is_int($reference)) {
            return $documents->where('number', $reference)->firstOr(
                DocumentMissing::throwing()->numbered($reference),
            );
        }

        return $documents->whereKey($reference)->firstOr(DocumentMissing::throwing()->identified($reference));
    }
}
