<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Api;

use Domain\Helpers\Api\ListHelperNoticesPayload;
use Domain\Helpers\Data\HelperNoticeListData;
use Domain\Helpers\Support\Readers\HelperNotices;

/**
 * Answers the newest notices the caller was left about its helpers' jobs.
 */
final readonly class ListHelperNoticesController
{
    public function __invoke(ListHelperNoticesPayload $call, HelperNotices $notices): HelperNoticeListData
    {
        return HelperNoticeListData::from([
            'notices' => $notices->newest(),
        ]);
    }
}
