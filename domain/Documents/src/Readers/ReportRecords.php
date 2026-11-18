<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\RecordComment;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordReading;
use Domain\Documents\Support\TextSelection;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;

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
            ->when($filters->searches(), fn (Builder $query) => $query->matchingText($filters->query))
            ->when($filters->after !== '', fn (Builder $query) => $query->where('id', '<', $filters->after), fn (Builder $query) => $query->offset(($filters->page - 1) * $size))
            ->orderByDesc('id')
            ->limit($size + 1)
            ->get();
        $page = $reports->take($size);

        return ReportList::from([
            'rows' => array_values($page->map(fn (Report $report) => $filters->searches() ? $report->hit($filters->query) : $report->card())->all()),
            'page' => $filters->page,
            'hasNextPage' => $reports->count() > $size,
            'next' => $reports->count() > $size ? $page->last()?->id : null,
        ]);
    }

    public function read(int $number, TextSelection $selection): RecordText
    {
        $report = Report::query()->sharedPublished()->where('number', $number)->first() ?? throw ReportMissing::numbered($number);

        return RecordReading::read("report {$number}", $report, $selection);
    }

    public function show(int $number): ReportView
    {
        $report = Report::query()->sharedPublished()->where('number', $number)->first();

        return $report?->view() ?? throw ReportMissing::numbered($number);
    }

    public function comments(int $number, int $page): array
    {
        $record = Report::query()->sharedPublished()->where('number', $number)->first() ?? throw ReportMissing::numbered($number);

        return array_values(RecordComment::query()->onRecord(Report::LINK_TYPE, $record->id)->forPage(max(1, $page), 50)->get()
            ->map(fn (RecordComment $comment) => $comment->card())->all());
    }
}
