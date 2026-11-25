<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Reports;

use App\Data\Pages\RecordCard;
use App\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBodyData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use Closure;
use Domain\Documents\Data\RecordCommentsPartData;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordLinksPartData;
use Domain\Documents\Data\RecordSharePartData;
use Domain\Documents\Data\ReportReceiptPartData;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Enums\AttentionState;

/**
 * A report's page as a publication: its title, label and abstract, then the tab the window chose. Text is the report's
 * body, the public-comment notice and its comments; Links its linked records; Details its attention, settlements,
 * Settle and Share.
 */
final readonly class ReportsShow extends ReportsPage
{
    /**
     * Each closure reads what one tab shows, only when that tab is chosen.
     *
     * @param  Closure(): bool  $isPublic  whether the report is shared publicly
     * @param  Closure(): RecordCommentsPartData  $comments
     * @param  Closure(): list<RecordCard>  $links
     * @param  Closure(): RecordInspection  $inspection
     */
    public function of(
        ReportView $report,
        int $number,
        string $tab,
        Closure $isPublic,
        Closure $comments,
        Closure $links,
        Closure $inspection,
    ): DeclaredLayoutData {
        $label = "report {$number}";

        return PublicationPage::make(
            $report->title,
            [
                LayoutPartData::text('label', $label, 'code'),
                LayoutPartData::native(
                    'receipt',
                    LayoutNativeData::of('documents/ReportReceipt', new ReportReceiptPartData((string) $number)),
                ),
            ],
            $report->abstract,
            fn () => LayoutBodyData::fromMarkdown($report->body),
            [
                PublicationTab::deferred('text', 'Text', fn () => $this->textOf($report, $isPublic(), $comments())),
                PublicationTab::deferred('links', 'Links', fn () => LayoutPartData::native(
                    'links',
                    LayoutNativeData::of('documents/RecordLinks', RecordLinksPartData::from([
                        'source' => $label,
                        'links' => $links(),
                    ])),
                )),
                PublicationTab::deferred(
                    'details',
                    'Details',
                    fn () => $this->detailsOf($report, $number, $label, $inspection()),
                ),
            ],
        )->layout($tab);
    }

    private function textOf(ReportView $report, bool $isPublic, RecordCommentsPartData $comments): LayoutPartData
    {
        $parts = [LayoutPartData::body('body', LayoutBodyData::fromMarkdown($report->body))];

        if ($isPublic) {
            $parts[] = LayoutPartData::notice(
                'public',
                'info',
                'This report is shared publicly: a comment you leave here will be public.',
            );
        }

        $parts[] = LayoutPartData::native('comments', LayoutNativeData::of('documents/RecordComments', $comments));

        return LayoutPartData::box('text', 'stack', ...$parts);
    }

    /**
     * The report's attention and settlements, the Settle form while it is active, sent with its fixed revision to the
     * registered settle route, and Share.
     */
    private function detailsOf(
        ReportView $report,
        int $number,
        string $label,
        RecordInspection $inspection,
    ): LayoutPartData {
        $settlements = array_map(
            fn (SettlementCard $settlement) => LayoutRowData::from(
                [
                    'key' => $settlement->settledAt,
                    'label' => "Settled {$settlement->settledAt} by {$settlement->actorType} {$settlement->actorId}",
                    'value' => $settlement->reason,
                ],
            ),
            $inspection->settlements,
        );

        $parts = [
            LayoutPartData::collection('facts', 'facts', [
                LayoutRowData::from([
                    'key' => 'editing',
                    'label' => 'Editing',
                    'value' => 'free',
                ]),
                LayoutRowData::from(
                    [
                        'key' => 'attention',
                        'label' => 'Attention',
                        'value' => $report->attention->value,
                    ],
                ),
            ]),
        ];

        if ($settlements !== []) {
            $parts[] = LayoutPartData::collection('settlements', 'list', $settlements);
        }

        if ($report->attention === AttentionState::Active) {
            $parts[] = LayoutPartData::form(
                'settle',
                LayoutFormData::from(
                    [
                        'method' => ActionMethod::Post,
                        'href' => route('documents.settle-report', ['report' => $number], false),
                        'fixed' => ['revision' => 1],
                    ],
                ),
                'inline',
                LayoutPartData::field('reason', 'Reason', new LayoutFieldData('reason'), 'text'),
                LayoutPartData::action('send', 'Settle', LayoutActionData::submitting()),
            );
        }

        $share = RecordSharePartData::from(['reference' => $label]);
        $parts[] = LayoutPartData::native('share', LayoutNativeData::of('documents/RecordShare', $share));

        return LayoutPartData::box('details', 'stack', ...$parts);
    }
}
