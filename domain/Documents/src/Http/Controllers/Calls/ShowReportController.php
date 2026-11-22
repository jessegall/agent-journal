<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Support\RecordReference;
use Domain\Documents\Calls\ShowReportCall;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\RecordText;

/**
 * Answers the part of a report's text asked for.
 */
final readonly class ShowReportController
{
    public function __invoke(ShowReportCall $call, ReportResolver $reports): RecordText
    {
        return $reports->read(RecordReference::number($call->number), $call->selection);
    }
}
