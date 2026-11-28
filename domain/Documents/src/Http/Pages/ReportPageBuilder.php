<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Reads\PageFormRequests;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Support\Layout\RecordLayoutData;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\RecordCommentsPartData;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Http\Pages\Reports\ReportsShow;
use Domain\Documents\Http\Requests\RecordPageRequest;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordPageReads;
use Illuminate\Http\Request;

/**
 * A report for its page: the report, and only for the tab the window chose its comments and whether it is shared
 * publicly, its links, or its settlements. It docks as the report it shows, and once shown marks the reader's
 * report-ready receipt of it read.
 */
final readonly class ReportPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private ReportResolver $reports,
        private CommentResolver $comments,
        private RecordResolver $records,
        private ShareStatusResolver $shares,
        private RecordPageReads $reads,
        private ReportsShow $page,
    ) {}

    public function build(Request $visit): ReportPageData
    {
        return ReportPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): RecordLayoutData
    {
        $input = $this->requests->from(RecordPageRequest::class, $visit);

        $number = $input->reportNumber();
        $report = $this->reports->show($number);
        $identity = $this->records->identify(RecordReference::of('report', $number));

        $layout = $this->page->of(
            $report,
            $number,
            $input->chosenTab(),
            fn () => $this->shares->isPubliclyShared($identity),
            fn () => RecordCommentsPartData::from([
                'comments' => $this->comments->list($identity, $input->commentsPage()),
                'target' => "report {$number}",
                'reads' => $this->reads->of($identity),
                'version' => '1',
            ]),
            fn () => $this->reports->links($number),
            fn () => $this->reports->inspect($number),
        );

        return RecordLayoutData::build()
            ->shown($layout)
            ->record(new RecordIdentity(Report::linkType(), $report->id))
            ->finish();
    }
}
