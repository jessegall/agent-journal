<?php

declare(strict_types=1);

namespace Domain\Helpers\Values;

use App\Sessions\OwnerStartReceipt;
use Domain\Helpers\Enums\JobStatus;

/**
 * What a dispatch tells its parent: the identity, the job and whether this request made it, the profile type, the job's
 * state, how the job was started, and Core's start for it with the model the adapter reports. Only the driver's own
 * callback confirms a resume.
 */
final readonly class HelperReceipt
{
    public function __construct(
        public string $identityId,
        public string $jobId,
        public bool $isNewJob,
        public string $profileType,
        public JobStatus $status,
        public SessionStartDetails $startDetails,
        public OwnerStartReceipt $start,
    ) {}
}
