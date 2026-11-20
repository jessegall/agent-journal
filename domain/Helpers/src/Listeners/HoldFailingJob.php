<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\Listener;
use App\Hooks\Events\HelperStopHeld;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Support\JobStopEvidence;

/**
 * Holds a helper job for repair once its helper failed its final checks the same way three times in a row, and
 * tells the parent once.
 */
final readonly class HoldFailingJob implements Listener
{
    public function handle(HelperStopHeld $event): void
    {
        foreach (JobStopEvidence::openJobs($event->work) as $job) {
            $job->hold(JobStopEvidence::referenceOf($event->attempt));
            HelperNotice::leave($job, sprintf(
                'Helper %s failed its final checks on job %s three times the same way; the job is held for repair.',
                $job->helper_identity_id,
                $job->id,
            ));
        }
    }
}
