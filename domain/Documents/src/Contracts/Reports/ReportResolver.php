<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts\Reports;

use App\Data\Pages\RecordCard;
use App\Support\TextSelection;
use App\Text\Exceptions\SectionMissing;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Report;
use Illuminate\Database\Eloquent\Collection;

/**
 * Reads the filed reports: a page of them, or one by its number.
 */
interface ReportResolver
{
    /**
     * The reports that match the filters.
     */
    public function list(DocumentFilters $filters): PublicationList;

    /** @return Collection<int, Report> */
    public function preview(DocumentFilters $filters, int $limit): Collection;

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
