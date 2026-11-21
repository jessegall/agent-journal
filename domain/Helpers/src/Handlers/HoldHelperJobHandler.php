<?php

declare(strict_types=1);

namespace Domain\Helpers\Handlers;

use Domain\Helpers\Commands\HoldHelperJob;
use Domain\Helpers\Handlers\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Support\JobStopEvidence;

final readonly class HoldHelperJobHandler extends HelperCommandHandler
{
    public function handle(HoldHelperJob $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job) use ($command): void {
            $job->hold($command->reference);
            HelperNotice::create($job, sprintf(
                'Helper %s failed its final checks on job %s three times the same way; the job is held for repair.',
                $job->helper_identity_id,
                $job->id,
            ));
        });
    }
}
