<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Report;
use Illuminate\Container\Attributes\Scoped;

/**
 * The filed reports, newest first, a page at a time.
 */
#[Scoped]
final readonly class ReportRecords implements ReportReader
{
    public function list(DocumentFilters $filters): ReportList
    {
        $size = $filters->pageSize()->rows;
        $reports = Report::query()->sharedPublished()->inAttention($filters->attention->state())
            ->forPage($filters->page, $size)
            ->limit($size + 1)
            ->get();

        return ReportList::from([
            'rows' => array_values($reports->take($size)->map(fn (Report $report) => $report->card())->all()),
            'page' => $filters->page,
            'hasNextPage' => $reports->count() > $size,
        ]);
    }

    public function show(int $number): ReportView
    {
        $report = Report::query()->sharedPublished()->where('number', $number)->first();

        return $report?->view() ?? throw ReportMissing::numbered($number);
    }
}
