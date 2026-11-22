<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use Domain\Helpers\Calls\ListHelperNoticesCall;
use Domain\Helpers\Data\HelperNoticeListData;
use Domain\Helpers\Support\Readers\HelperNotices;

/**
 * Answers the newest notices the caller was left about its helpers' jobs.
 */
final readonly class ListHelperNoticesController
{
    public function __invoke(ListHelperNoticesCall $call, HelperNotices $notices): HelperNoticeListData
    {
        return HelperNoticeListData::from([
            'notices' => $notices->newest(),
        ]);
    }
}
