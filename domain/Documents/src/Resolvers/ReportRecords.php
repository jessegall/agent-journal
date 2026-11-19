<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Records\Contracts\RecordResolver;
use App\Text\Support\TextSelection;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportList;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\EditingState;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordReading;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;

/**
 * The filed reports, newest first, a page at a time.
 */
#[Scoped]
final readonly class ReportRecords implements ReportResolver
{
    public function __construct(private RecordResolver $records) {}

    public function list(DocumentFilters $filters): ReportList
    {
        $size = $filters->pageSize()->rows;
        $reports = Report::query()->sharedPublished()->inAttention($filters->attention->state())
            ->when($filters->searches(), fn (Builder $query) => $query->matchingText($filters->query))
            ->when(
                $filters->after !== '',
                fn (Builder $query) => $query->where('id', '<', $filters->after),
                fn (Builder $query) => $query->offset(($filters->page - 1) * $size),
            )
            ->orderByDesc('id')
            ->limit($size + 1)
            ->get();
        $page = $reports->take($size);

        return ReportList::from([
            'rows' => array_values(
                $page->map(
                    fn (Report $report) => $filters->searches() ? $report->searchResult($filters->query) : $report->card(),
                )->all(),
            ),
            'page' => $filters->page,
            'hasNextPage' => $reports->count() > $size,
            'next' => $reports->count() > $size ? $page->last()?->id : null,
        ]);
    }

    public function read(int $number, TextSelection $selection): RecordText
    {
        $report = self::published($number);

        return RecordReading::read("report {$number}", $report, $selection);
    }

    public function show(int $number): ReportView
    {
        return self::published($number)->view();
    }

    public function inspect(int $number): RecordInspection
    {
        $report = self::published($number);

        return RecordInspection::from([
            'label' => "report {$number}",
            'attention' => $report->attention,
            'editing' => ['state' => EditingState::Free],
            'settlements' => $report->settlements(),
            'closes' => [],
            'links' => $this->records->linkedCards($report),
        ]);
    }

    public function links(int $number): array
    {
        $report = self::published($number);

        return $this->records->linkedCards($report);
    }

    /**
     * The published report with that number; refused when it is missing or hidden.
     *
     * @throws ReportMissing
     */
    private static function published(int $number): Report
    {
        return Report::query()
            ->sharedPublished()
            ->where('number', $number)
            ->firstOr(fn () => throw ReportMissing::numbered($number));
    }
}
