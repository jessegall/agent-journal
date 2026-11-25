<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Contracts\Records\RecordResolver;
use App\Contracts\Sharing\ShareStatusResolver;
use App\Data\Docks\DockablePublicationData;
use App\Support\Cards\DockIdentity;
use App\Support\RecordReference;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\RecordCommentsPartData;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Http\Pages\Reports\ReportsShow;
use Domain\Documents\Http\Requests\RecordPageRequest;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordPageReads;

/**
 * A report for its page: the report, and only for the tab the window chose its comments and whether it is shared
 * publicly, its links, or its settlements. It docks as the report it shows, and once shown marks the reader's
 * report-ready receipt of it read.
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
        private ReportsShow $page,
    ) {}

    public function read(): DockablePublicationData
    {
        $number = $this->request->reportNumber();
        $report = $this->reports->show($number);
        $identity = $this->records->identify(RecordReference::of('report', $number));

        $layout = $this->page->of(
            $report,
            $number,
            $this->request->chosenTab(),
            fn () => $this->shares->isPubliclyShared($identity),
            fn () => RecordCommentsPartData::from([
                'comments' => $this->comments->list($identity, $this->request->commentsPage()),
                'target' => "report {$number}",
                'reads' => $this->reads->of($identity),
                'version' => '1',
            ]),
            fn () => $this->reports->links($number),
            fn () => $this->reports->inspect($number),
        );

        return DockablePublicationData::of($layout, new DockIdentity(Report::linkType(), $report->id));
    }
}
