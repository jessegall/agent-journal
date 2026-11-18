<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Agents\Contracts\SessionReader;
use App\Assignments\Support\Page;
use App\Comments\Contracts\CommentReader;
use App\Numbers\Support\RecordReference;
use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordReader;
use App\Sharing\Contracts\ShareStatusReader;
use App\Ui\Contracts\PageReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DockSession;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Http\Requests\RecordPageRequest;

/**
 * One report's page, its body rendered to safe HTML; a report has no revisions.
 */
final readonly class ReportWindowReader implements PageReader
{
    public function __construct(private RecordPageRequest $request, private ReportReader $reports, private SessionReader $sessions, private CommentReader $comments, private RecordReader $records, private ShareStatusReader $shares) {}

    public function read(): RecordPageData
    {
        $number = $this->request->reportNumber();
        $identity = $this->records->identify(RecordReference::of('report', $number));

        return RecordPageData::fromReportView($this->reports->show($number), $this->comments->list($identity, new Page(null, PageSize::from(null)->rows)), $this->reports->inspect($number)->settlements, $this->reports->links($number), array_map(DockSession::fromSessionOption(...), $this->sessions->active()), $this->shares->isPubliclyShared($identity));
    }
}
