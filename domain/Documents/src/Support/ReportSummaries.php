<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\SummaryProvider;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Records\Values\SummaryPage;
use App\Values\ProjectOwner;
use Domain\Documents\Models\Report;

/**
 * Filed reports as a short card shows them: the title, where the report stands and the start of its abstract, with its
 * page. One is read by its id, a batch in one query.
 */
final readonly class ReportSummaries implements SummaryProvider
{
    /**
     * The most characters of a report's abstract its short card shows.
     */
    private const int ABSTRACT_CHARACTER_LIMIT = 120;

    public function requireReadable(string $id): RecordSummary
    {
        return self::summary(
            Report::query()
                ->sharedPublished()
                ->whereKey($id)
                ->firstOr(RecordUnavailable::throwing()->forModel(Report::class, $id)),
        );
    }

    public function ownerOf(string $id): ProjectOwner
    {
        return Report::query()
            ->whereKey($id)
            ->firstOr(RecordUnavailable::throwing()->forModel(Report::class, $id))
            ->projectOwner();
    }

    public function visibleSummaries(array $ids): array
    {
        $reports = Report::query()->sharedPublished()->whereKey($ids)->readExactly(count($ids))->get();

        return array_values($reports->map(self::summary(...))->all());
    }

    private static function summary(Report $report): RecordSummary
    {
        $abstract = mb_strimwidth($report->abstract, 0, self::ABSTRACT_CHARACTER_LIMIT, '…');

        return new RecordSummary(
            $report->id,
            $report->title,
            $report->attention->standing(),
            [new SummaryLine('abstract', $abstract)],
            page: new SummaryPage('documents.report', 'report', (string) $report->number),
        );
    }
}
