<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use Domain\Documents\Data\CommentCard;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Exceptions\SectionMissing;
use Domain\Documents\Readers\ReportRecords;
use Domain\Documents\Support\TextSelection;
use Illuminate\Container\Attributes\Bind;

/**
 * Reads the filed reports: a page of them, or one by its number.
 */
#[Bind(ReportRecords::class)]
interface ReportReader
{
    public function list(DocumentFilters $filters): ReportList;

    /**
     * @throws ReportMissing
     */
    public function show(int $number): ReportView;

    /**
     * A bounded read of the report's text.
     *
     * @throws ReportMissing|SectionMissing
     */
    public function read(int $number, TextSelection $selection): RecordText;

    /**
     * A page of 50 of the record's comments, oldest first.
     *
     * @return list<CommentCard>
     *
     * @throws ReportMissing
     */
    public function comments(int $number, int $page): array;

    /**
     * @throws ReportMissing
     */
    public function inspect(int $number): RecordInspection;
}
