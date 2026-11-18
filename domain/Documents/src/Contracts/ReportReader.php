<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Readers\ReportRecords;
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
}
