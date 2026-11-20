<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use Domain\Helpers\Calls\ListHelperNoticesCall;
use Domain\Helpers\Contracts\HelperReader;
use Domain\Helpers\Http\Data\HelperNoticeData;
use Domain\Helpers\Http\Data\HelperNoticeListData;

/**
 * Answers the newest notices the caller was left about its helpers' jobs.
 */
final readonly class ListHelperNoticesController
{
    public function __invoke(ListHelperNoticesCall $call, HelperReader $helpers): HelperNoticeListData
    {
        return HelperNoticeListData::from([
            'notices' => HelperNoticeData::collect($helpers->notices()),
        ]);
    }
}
