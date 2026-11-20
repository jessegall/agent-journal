<?php

declare(strict_types=1);

namespace Domain\Helpers\Readers;

use App\Agents\Contracts\StartReceipts;
use Domain\Helpers\Contracts\HelperReader;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperReceipt;

/**
 * Reads a receipt from the job, its identity and Core's start for the job; the parent's actor scope hides every
 * other parent's job.
 */
final readonly class HelperRecords implements HelperReader
{
    public function __construct(private StartReceipts $starts) {}

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
