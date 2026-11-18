<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use App\Records\Data\RecordCard;
use App\Text\Exceptions\SectionMissing;
use App\Text\Support\TextSelection;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Readers\DocumentRecords;
use Illuminate\Container\Attributes\Bind;

/**
 * Reads the published documents: a page of them, or one by its number with its current text.
 */
#[Bind(DocumentRecords::class)]
interface DocumentReader
{
    public function list(DocumentFilters $filters): DocumentList;

    /**
     * @throws DocumentMissing
     */
    public function show(int $number): DocumentView;

    /**
     * A bounded read of one revision, the current one unless named; a read that continues one begun on another
     * revision is refused.
     *
     * @throws DocumentMissing|StaleRead|SectionMissing
     */
    public function read(int $number, TextSelection $selection, int|null $revision = null, int|null $expectedRevision = null): RecordText;

    /**
     * The revisions of a document in number order, a page of 50 at a time.
     *
     * @return list<RevisionCard>
     *
     * @throws DocumentMissing
     */
    public function revisions(int $documentNumber, int $page): array;

    /**
     * @throws DocumentMissing
     */
    public function revision(int $documentNumber, int $revisionNumber): RevisionView;

    /**
     * @throws DocumentMissing
     */
    public function inspect(int $number): RecordInspection;

    /**
     * The records linked to this one that the actor may see.
     *
     * @return list<RecordCard>
     */
    public function links(int $number): array;
}
