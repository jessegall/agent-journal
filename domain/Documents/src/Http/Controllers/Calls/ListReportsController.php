<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use Domain\Documents\Calls\ListReportsCall;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\ReportList;

/**
 * Answers one page of reports.
 */
final readonly class ListReportsController
{
    public function __invoke(ListReportsCall $call, ReportResolver $reports): ReportList
    {
        return $reports->list(new DocumentFilters(
            attention: $call->attention,
            page: $call->page,
            query: (string) $call->query,
            revisions: false,
            after: (string) $call->after,
        ));
    }
}
