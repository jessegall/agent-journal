<?php

declare(strict_types=1);

namespace Domain\Helpers\Readers;

use App\Agents\Contracts\StartReceipts;
use App\Agents\Exceptions\StartRecordMissing;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Values\HelperReceipt;

/**
 * The caller's own helper jobs as their dispatch receipts, read again later, such as after the parent restarts: each
 * from the job, its identity and Core's start for it; the parent's actor scope hides every other parent's job.
 */
final readonly class HelperRecords
{
    public function __construct(private StartReceipts $starts) {}

    /**
     * @throws HelperUnavailable
     * @throws StartRecordMissing
     */
    public function receiptOf(string $jobId): HelperReceipt
    {
        $job = HelperJob::query()->whereKey($jobId)->firstOr(fn () => throw HelperUnavailable::toYou());
        $identity = HelperIdentity::query()->findOrFail($job->helper_identity_id);

        return $job->receipt(
            $identity->profile_base,
            $this->starts->receiptFor($job->assignmentIdentity()),
            false,
        );
    }
}
