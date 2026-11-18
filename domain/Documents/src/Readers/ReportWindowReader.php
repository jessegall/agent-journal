<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Ui\Contracts\PageReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Http\Requests\RecordPageRequest;

/**
 * One report's page, its body rendered to safe HTML; a report has no revisions.
 */
final readonly class ReportWindowReader implements PageReader
{
    public function __construct(private RecordPageRequest $request, private ReportReader $reports) {}

    public function read(): RecordPageData
    {
        $number = $this->request->reportNumber();

        return RecordPageData::fromReportView($this->reports->show($number), $this->reports->comments($number, 1), $this->reports->inspect($number)->settlements);
    }
}
