<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\Listener;
use App\Hooks\Events\HelperCompletionCertified;
use Domain\Helpers\Support\JobStopEvidence;

/**
 * Finishes a helper job once Core certifies its helper's stop: its final checks passed, never because the program
 * exited.
 */
final readonly class FinishCertifiedJob implements Listener
{
    public function handle(HelperCompletionCertified $event): void
    {
        foreach (JobStopEvidence::openJobs($event->work) as $job) {
            $job->finish(JobStopEvidence::referenceOf($event->attempt));
        }
    }
}
