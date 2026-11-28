<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\ShareBudget;
use App\Records\Contracts\ShareRecordProvider;
use App\Skills\Exceptions\ContentTooLarge;
use App\Support\MarkdownText;
use App\Support\RecordIdentity;
use App\Support\ShareContentRequest;
use App\Support\SharedContent;
use App\Values\ProjectOwner;
use Domain\Comments\Contracts\PublicCommentResolver;
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
        return $record->type === Report::linkType() && Report::query()->sharedPublished()->whereKey(
            $record->id,
        )->exists();
    }

    /**
     * @throws RecordUnavailable when the report is missing
     */
    public function ownerOf(RecordIdentity $record): ProjectOwner
    {
        return Report::query()
            ->whereKey($record->id)
            ->firstOr(RecordUnavailable::throwing()->forActor($record))
            ->projectOwner();
    }

    /**
     * @throws RecordUnavailable
     * @throws ContentTooLarge when the stored body is larger than a body may be
     */
    public function content(ShareContentRequest $read, ShareBudget $budget): SharedContent
    {
        $report = Report::query()->sharedPublished()->whereKey($read->record->id)->firstOr(
            RecordUnavailable::throwing()->forActor($read->record),
        );

        $bytes = Report::bodyBytesOf($report->id);

        if ($bytes > MarkdownText::BODY_BYTES) {
            throw ContentTooLarge::field("body of report {$report->number}", '1 MiB');
        }

        $budget->chargeText($bytes);

        return new SharedContent($report->shareCard, (string) Report::query()->whereKey($report->id)->value('body'));
    }

    private function linkType(): string
    {
        return Report::linkType();
    }

    private function cardsOf(array $ids): array
    {
        return array_values(Report::query()->sharedPublished()->whereKey($ids)->get(
            self::CARD_COLUMNS,
        )
            ->map(fn (Report $report) => $report->share_card)->all());
    }
}
