<?php

declare(strict_types=1);

namespace Domain\Helpers\Contracts;

use App\Agents\Exceptions\StartRecordMissing;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Support\HelperReceipt;

/**
 * The caller's own helper jobs as their dispatch receipts, read again later, such as after the parent restarts;
 * another parent's job answers as unavailable.
 */
interface HelperReader
{
    /**
     * @throws HelperUnavailable
     * @throws StartRecordMissing
     */
    public function receiptOf(string $jobId): HelperReceipt;
}
