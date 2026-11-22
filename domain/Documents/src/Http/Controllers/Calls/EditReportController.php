<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Values\CallAccepted;
use Domain\Documents\Calls\EditReportCall;
use Domain\Documents\Exceptions\ReportUnchangeable;

/**
 * Refuses every change to a report.
 */
final readonly class EditReportController
{
    /**
     * @throws ReportUnchangeable
     */
    public function __invoke(EditReportCall $call): CallAccepted
    {
        throw ReportUnchangeable::snapshot();
    }
}
