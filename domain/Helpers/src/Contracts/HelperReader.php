<?php

declare(strict_types=1);

namespace Domain\Helpers\Contracts;

use App\Agents\Exceptions\StartRecordMissing;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Support\HelperReceipt;

/**
 * The caller's own helper jobs as their dispatch receipts, read again later, such as after the parent restarts, and
 * the notices it was left about them; another parent's job answers as unavailable.
 */
interface HelperReader
{
    /**
     * @throws HelperUnavailable
     * @throws StartRecordMissing
     */
    public function receiptOf(string $jobId): HelperReceipt;

    /**
     * The newest notices the caller was left about its helpers' jobs, at most 50.
     *
     * @return list<HelperNotice>
     */
    public function notices(): array;
}
