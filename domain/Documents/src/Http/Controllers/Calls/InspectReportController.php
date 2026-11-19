<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Numbers\Support\RecordReference;
use Domain\Documents\Calls\InspectReportCall;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\RecordInspection;

/**
 * Answers the inspection of a report.
 */
final readonly class InspectReportController
{
    public function __invoke(InspectReportCall $call, ReportResolver $reports): RecordInspection
    {
        return $reports->inspect(RecordReference::number($call->number));
    }
}
