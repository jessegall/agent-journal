<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Reports;

use App\Connections\Layout\LayoutBodyData;
use App\Data\Pages\RecordCard;
use App\Settings\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use Closure;
use Domain\Comments\Data\RecordCommentsPartData;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Data\RecordLinksPartData;
use Domain\Documents\Data\RecordSharePartData;
use Domain\Documents\Data\ReportReceiptPartData;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Enums\AttentionStatus;

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

        return PublicationPage::build()
            ->title($report->title)
            ->metadata(
                [
                    LayoutPartData::build()->asText()->key('label')->value($label)->style('code')->finish(),
                    LayoutPartData::build()
                        ->asNative()
                        ->key('receipt')
                        ->native(
                            LayoutNativeData::build()
                            ->component('documents/ReportReceipt')
                            ->props(new ReportReceiptPartData((string) $number))
                            ->finish(),
                        )
                        ->finish(),
                ],
            )
            ->summary($report->abstract)
            ->body(fn () => LayoutBodyData::fromMarkdown($report->body))
            ->tabs(
                [
                    PublicationTab::deferred('text', 'Text', fn () => $this->textOf($report, $isPublic(), $comments())),
                    PublicationTab::deferred('links', 'Links', fn () => LayoutPartData::build()
                        ->asNative()
                        ->key('links')
                        ->native(
                            LayoutNativeData::build()
                            ->component('documents/RecordLinks')
                            ->props(
                                RecordLinksPartData::from([
                                    'source' => $label,
                                    'links' => $links(),
                                ]),
                            )
                            ->finish(),
                        )
                        ->finish()),
                    PublicationTab::deferred(
                        'details',
                        'Details',
                        fn () => $this->detailsOf($report, $number, $label, $inspection()),
                    ),
                ],
            )
            ->finish()->layout($tab);
    }

    private function textOf(ReportView $report, bool $isPublic, RecordCommentsPartData $comments): LayoutPartData
    {
        $parts = [LayoutPartData::build()
            ->asBody()
            ->key('body')
            ->body(LayoutBodyData::fromMarkdown($report->body))
            ->finish()];

        if ($isPublic) {
            $parts[] = LayoutPartData::build()
                ->asNotice()
                ->key('public')
                ->style('info')
                ->title('This report is shared publicly: a comment you leave here will be public.')
                ->finish();
        }

        $parts[] = LayoutPartData::build()
            ->asNative()
            ->key('comments')
            ->native(
                LayoutNativeData::build()->component('comments/RecordComments')->props($comments)->finish(),
            )
            ->finish();

        return LayoutPartData::build()->asBox()->key('text')->style('stack')->children(...$parts)->finish();
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
            fn (SettlementCard $settlement) => LayoutRowData::build()
                ->key($settlement->settledAt)
                ->label("Settled {$settlement->settledAt} by {$settlement->actorType} {$settlement->actorId}")
                ->value($settlement->reason)
                ->finish(),
            $inspection->settlements,
        );

        $parts = [
            LayoutPartData::build()
                ->asCollection()
                ->key('facts')
                ->style('facts')
                ->rows(
                    [
                        LayoutRowData::build()->key('editing')->label('Editing')->value('free')->finish(),
                        LayoutRowData::build()
                            ->key('attention')
                            ->label('Attention')
                            ->value($report->attention->value)
                            ->finish(),
                    ],
                )
                ->finish(),
        ];

        if ($settlements !== []) {
            $parts[] = LayoutPartData::build()
                ->asCollection()
                ->key('settlements')
                ->style('list')
                ->rows($settlements)
                ->finish();
        }

        if ($report->attention === AttentionStatus::Active) {
            $parts[] = LayoutPartData::build()
                ->asForm()
                ->key('settle')
                ->form(
                    LayoutFormData::build()
                        ->method(ActionMethod::Post)
                        ->href(route('documents.settle-report', ['report' => $number], false))
                        ->fixed(['revision' => 1])
                        ->finish(),
                )
                ->style('inline')
                ->children(
                    LayoutPartData::build()
                    ->asField()
                    ->key('reason')
                    ->label('Reason')
                    ->field(LayoutFieldData::build()->name('reason')->finish())
                    ->style('text')
                    ->finish(),
                    LayoutPartData::build()
                    ->asAction()
                    ->key('send')
                    ->label('Settle')
                    ->action(LayoutActionData::build()->submits(true)->finish())
                    ->finish(),
                )
                ->finish();
        }

        $share = RecordSharePartData::from(['reference' => $label]);
        $parts[] = LayoutPartData::build()
            ->asNative()
            ->key('share')
            ->native(LayoutNativeData::build()->component('documents/RecordShare')->props($share)->finish())
            ->finish();

        return LayoutPartData::build()->asBox()->key('details')->style('stack')->children(...$parts)->finish();
    }
}
