<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Support\RecordReference;
use Domain\Documents\Api\InspectReportPayload;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\RecordInspection;

/**
 * Answers the inspection of a report.
 */
final readonly class InspectReportController
{
    public function __invoke(InspectReportPayload $call, ReportResolver $reports): RecordInspection
    {
        return $reports->inspect(RecordReference::number($call->number));
    }
}
