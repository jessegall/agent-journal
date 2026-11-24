<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Reports;

use App\Data\Pages\RecordCard;
use App\Exceptions\SectionMissing;
use App\Support\TextSelection;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Exceptions\ReportMissing;

/**
 * Reads the filed reports: a page of them, or one by its number.
 */
interface ReportResolver
{
    /**
     * The reports that match the filters.
     */
    public function list(DocumentFilters $filters): PublicationList;

    /**
     * How many reports are still open.
     */
    public function openCount(): int;

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
     * @throws ReportMissing
     */
    public function inspect(int $number): RecordInspection;

    /**
     * The records linked to this one that the actor may see.
     *
     * @return list<RecordCard>
     */
    public function links(int $number): array;
}
