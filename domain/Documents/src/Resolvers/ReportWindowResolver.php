<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Assignments\Support\Page;
use App\Comments\Contracts\CommentResolver;
use App\Numbers\Support\RecordReference;
use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Ui\Contracts\PageResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Http\Requests\RecordPageRequest;

/**
 * One report's page, its body rendered to safe HTML; a report has no revisions.
 */
final readonly class ReportWindowResolver implements PageResolver
{
    public function __construct(
        private RecordPageRequest $request,
        private ReportResolver $reports,
        private CommentResolver $comments,
        private RecordResolver $records,
        private ShareStatusResolver $shares,
    ) {}

    public function read(): RecordPageData
    {
        $number = $this->request->reportNumber();
        $identity = $this->records->identify(RecordReference::of('report', $number));

        return RecordPageData::fromReportView(
            $this->reports->show($number),
            $this->comments->list($identity, new Page(null, PageSize::from(null)->rows)),
            $this->reports->inspect($number)->settlements,
            $this->reports->links($number),
            $this->shares->isPubliclyShared($identity),
        );
    }
}
