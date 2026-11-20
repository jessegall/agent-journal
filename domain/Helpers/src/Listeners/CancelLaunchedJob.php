<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Agents\Events\LaunchCancelled;
use App\Contracts\Listener;
use Domain\Helpers\Support\JobStopEvidence;

/**
 * Marks a helper job cancelled once its launch was cancelled; the helper's workspace stays.
 */
final readonly class CancelLaunchedJob implements Listener
{
    public function handle(LaunchCancelled $event): void
    {
        foreach (JobStopEvidence::openJobs($event->work) as $job) {
            $job->cancel();
        }
    }
}
