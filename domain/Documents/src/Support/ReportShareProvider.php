<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\Records\PublicCommentResolver;
use App\Contracts\Sharing\ShareBudget;
use App\Contracts\Sharing\ShareRecordProvider;
use App\Exceptions\ContentTooLarge;
use App\Exceptions\RecordUnavailable;
use App\Support\MarkdownText;
use App\Support\RecordIdentity;
use App\Support\ShareContentRead;
use App\Support\SharedContent;
use Domain\Documents\Concerns\SharesPublishedRecords;
use Domain\Documents\Models\Report;

/**
 * Reports for a public share: a filed report discloses its immutable body, measured in the database before it is
 * loaded.
 */
final readonly class ReportShareProvider implements ShareRecordProvider
{
    use SharesPublishedRecords;

    private const array CARD_COLUMNS = [
        'id',
        'number',
        'title',
        'filed_at',
    ];

    public function __construct(private PublicCommentResolver $comments) {}

    public function mayDisclose(RecordIdentity $record): bool
    {
        return $record->type === Report::LINK_TYPE && Report::query()->sharedPublished()->whereKey(
            $record->id,
        )->exists();
    }

    /**
     * @throws RecordUnavailable
     * @throws ContentTooLarge when the stored body is larger than a body may be
     */
    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent
    {
        $report = Report::query()->sharedPublished()->whereKey($read->record->id)->firstOr(
            fn () => throw RecordUnavailable::forActor($read->record),
        );

        $bytes = Report::bodyBytesOf($report->id);

        if ($bytes > MarkdownText::BODY_BYTES) {
            throw ContentTooLarge::field("body of report {$report->number}", '1 MiB');
        }

        $budget->chargeText($bytes);

        return new SharedContent($report->shareCard(), (string) Report::query()->whereKey($report->id)->value('body'));
    }

    private function linkType(): string
    {
        return Report::LINK_TYPE;
    }

    private function cardsOf(array $ids): array
    {
        return array_values(Report::query()->sharedPublished()->whereKey($ids)->readExactly(count($ids))->get(
            self::CARD_COLUMNS,
        )
            ->map(fn (Report $report) => $report->shareCard())->all());
    }
}
