<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Records\Contracts\RecordResolver;
use App\Support\Layout\LayoutRowData;
use App\Support\TextSelection;
use Domain\Documents\Contracts\Reports\ReportResolver as ReportResolverContract;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Enums\EditingStatus;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordTextReader;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;

/**
 * The filed reports, newest first, a page at a time.
 */
#[Scoped]
final readonly class ReportResolver implements ReportResolverContract
{
    public function __construct(private RecordResolver $records) {}

    public function list(DocumentFilters $filters): PublicationList
    {
        $size = $filters->pageSize()->rows;
        $words = $filters->searchWords();

        $reports = $this->matching($filters)
            ->when(
                $filters->after !== null,
                fn (Builder $query) => $query->where('id', '<', $filters->after),
                fn (Builder $query) => $query->offset(($filters->page - 1) * $size),
            )
            ->newestFirst()
            ->limit($size + 1)
            ->get();

        $page = $reports->take($size);

        return PublicationList::from([
            'rows' => array_values(
                $page->map(
                    fn (Report $report) => $filters->searches() ? $report->searchResult($words->get()) : $report->card,
                )->all(),
            ),
            'page' => $filters->page,
            'hasNextPage' => $reports->count() > $size,
            'next' => $reports->count() > $size ? $page->last()?->id : null,
        ]);
    }

    /** @return list<LayoutRowData> */
    public function preview(DocumentFilters $filters, int $limit): array
    {
        $records = $this->matching($filters)
            ->newestFirst()
            ->limit($limit)
            ->get(['id', 'number', 'title']);

        return array_values($records->map(fn (Report $record) => LayoutRowData::build()
            ->key($record->id)
            ->label($record->title)
            ->value('Report')
            ->href(route('documents.report', ['report' => $record->number], false))
            ->finish())->all());
    }

    /** @return Builder<Report> */
    private function matching(DocumentFilters $filters): Builder
    {
        $words = $filters->searchWords();

        return Report::query()->sharedPublished()->inAttention($filters->attention->state())
            ->when($filters->searches(), fn (Builder $query) => $query->matchingText($words->get()));
    }

    public function read(int $number, TextSelection $selection): RecordText
    {
        $report = self::published($number);

        return RecordTextReader::read("report {$number}", $report, $selection);
    }

    public function openCount(): int
    {
        return Report::query()->sharedPublished()->inAttention(AttentionStatus::Active)->count();
    }

    public function show(int $number): ReportView
    {
        return self::published($number)->view;
    }

    public function inspect(int $number): RecordInspection
    {
        $report = self::published($number);

        return RecordInspection::from([
            'label' => "report {$number}",
            'attention' => $report->attention,
            'editing' => ['status' => EditingStatus::Free],
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
    public static function published(int|string $reference): Report
    {
        $reports = Report::query()->sharedPublished();

        if (is_int($reference)) {
            return $reports->where('number', $reference)->firstOr(ReportMissing::throwing()->numbered($reference));
        }

        return $reports->whereKey($reference)->firstOr(ReportMissing::throwing()->identified($reference));
    }
}
