<?php

declare(strict_types=1);

namespace Domain\Helpers\Values;

use App\Support\OwnerStartReceipt;
use Domain\Helpers\Enums\JobState;

/**
 * What a dispatch tells its parent: the identity, the job and whether this request made it, the profile type, the
 * job's state, how the job was launched (identity new, independent, the conversation asked for and why) and Core's
 * start for it (the launch, its session, selection, where it runs and the actual model as the adapter reports it).
 * The conversation is the one asked for; only the driver's own callback confirms a resume.
 */
final readonly class HelperReceipt
{
    public function __construct(
        public string $identityId,
        public string $jobId,
        public bool $isNewJob,
        public string $profileType,
        public JobState $state,
        public JobLaunch $launch,
        public OwnerStartReceipt $start,
    ) {}
}
