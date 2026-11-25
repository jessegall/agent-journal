<?php

declare(strict_types=1);

namespace Domain\Helpers\Support\Readers;

use Domain\Helpers\Data\HelperNoticeData;
use Domain\Helpers\Models\HelperNotice;

/**
 * The newest notices the caller was left about its helpers' jobs, for the signed notices call.
 */
final readonly class HelperNotices
{
    /**
     * The most notices one read answers.
     */
    private const int NOTICE_LIMIT = 50;

    /**
     * @return list<HelperNoticeData>
     */
    public function newest(): array
    {
        $notices = HelperNotice::query()->newestFirst()->limit(self::NOTICE_LIMIT)->get()->all();

        return array_values(HelperNoticeData::collect($notices));
    }
}
