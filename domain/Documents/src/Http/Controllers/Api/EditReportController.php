<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Values\ApiAccepted;
use Domain\Documents\Api\EditReportPayload;
use Domain\Documents\Exceptions\ReportUnchangeable;

/**
 * Refuses every change to a report.
 */
final readonly class EditReportController
{
    /**
     * @throws ReportUnchangeable
     */
    public function __invoke(EditReportPayload $call): ApiAccepted
    {
        throw ReportUnchangeable::snapshot();
    }
}
