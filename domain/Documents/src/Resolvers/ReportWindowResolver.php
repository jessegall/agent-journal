<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Comments\Contracts\CommentResolver;
use App\Docking\Cards\DockIdentity;
use App\Docking\Data\DockablePublicationData;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Ui\Contracts\PageResolver;
use App\Ui\Enums\ActionMethod;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutBodyData;
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutFormData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use App\Ui\Layout\PublicationPage;
use App\Ui\Layout\PublicationTab;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\RecordCommentsPartData;
use Domain\Documents\Data\RecordLinksPartData;
use Domain\Documents\Data\RecordSharePartData;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Http\Requests\RecordPageRequest;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordPageReads;

/**
 * A report's page as a publication: its title, label and abstract, then the tab the window chose, read alone. Text is
 * the report's body, the public-comment notice and its comments; Links its linked records; Details its attention,
 * settlements, Settle and Share. It docks as the report it shows.
 */
final readonly class ReportWindowResolver implements PageResolver
{
    public function __construct(
        private RecordPageRequest $request,
        private ReportResolver $reports,
        private CommentResolver $comments,
        private RecordResolver $records,
        private ShareStatusResolver $shares,
        private RecordPageReads $reads,
    ) {}

    public function read(): DockablePublicationData
    {
        $number = $this->request->reportNumber();
        $report = $this->reports->show($number);
        $identity = $this->records->identify(RecordReference::of('report', $number));
        $label = "report {$number}";

        $page = PublicationPage::make(
            $report->title,
            [LayoutPartData::text('label', $label, 'code')],
            $report->abstract,
            fn () => LayoutBodyData::fromMarkdown($report->body),
            [
                PublicationTab::deferred('text', 'Text', fn () => $this->textOf($report, $identity, $label)),
                PublicationTab::deferred('links', 'Links', fn () => LayoutPartData::native(
                    'links',
                    LayoutNativeData::of('documents/RecordLinks', RecordLinksPartData::from([
                        'source' => $label,
                        'links' => $this->reports->links($number),
                    ])),
                )),
                PublicationTab::deferred('details', 'Details', fn () => $this->detailsOf($report, $number, $label)),
            ],
        );

        return DockablePublicationData::of(
            $page->layout($this->request->chosenTab()),
            new DockIdentity(Report::LINK_TYPE, $report->id),
        );
    }

    private function textOf(ReportView $report, RecordIdentity $identity, string $label): LayoutPartData
    {
        $parts = [LayoutPartData::body('body', LayoutBodyData::fromMarkdown($report->body))];

        if ($this->shares->isPubliclyShared($identity)) {
            $parts[] = LayoutPartData::notice(
                'public',
                'info',
                'This report is shared publicly: a comment you leave here will be public.',
            );
        }

        $comments = RecordCommentsPartData::from([
            'comments' => $this->comments->list($identity, $this->request->commentsPage()),
            'target' => $label,
            'reads' => $this->reads->of($identity),
        ]);
        $parts[] = LayoutPartData::native('comments', LayoutNativeData::of('documents/RecordComments', $comments));

        return LayoutPartData::box('text', 'stack', ...$parts);
    }

    /**
     * The report's attention and settlements, the Settle form while it is active, sent with its fixed revision to the
     * registered settle route, and Share.
     */
    private function detailsOf(ReportView $report, int $number, string $label): LayoutPartData
    {
        $settlements = array_map(fn ($settlement) => new LayoutRowData(
            $settlement->settledAt,
            "Settled {$settlement->settledAt} by {$settlement->actorType} {$settlement->actorId}",
            $settlement->reason,
        ), $this->reports->inspect($number)->settlements);

        $parts = [
            LayoutPartData::collection('facts', 'facts', [
                new LayoutRowData('editing', 'Editing', 'free'),
                new LayoutRowData('attention', 'Attention', $report->attention->value),
            ]),
        ];

        if ($settlements !== []) {
            $parts[] = LayoutPartData::collection('settlements', 'list', $settlements);
        }

        if ($report->attention === AttentionState::Active) {
            $parts[] = LayoutPartData::form(
                'settle',
                new LayoutFormData(
                    ActionMethod::Post,
                    route('documents.settle-report', ['report' => $number], false),
                    ['revision' => 1],
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
