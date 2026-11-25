<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Support\RecordReference;
use Domain\Documents\Api\ShowReportPayload;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\RecordText;

/**
 * Answers the part of a report's text asked for.
 */
final readonly class ShowReportController
{
    public function __invoke(ShowReportPayload $call, ReportResolver $reports): RecordText
    {
        return $reports->read(RecordReference::number($call->number), $call->selection);
    }
}
