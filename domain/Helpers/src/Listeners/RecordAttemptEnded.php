<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Agents\Events\LaunchEnded;
use App\Contracts\Listener;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Support\HelperStarts;
use Domain\Helpers\Support\JobStopEvidence;

/**
 * Records that a helper's attempt at a job ended before its stop was certified: the job stays unfinished, never
 * finished by an exit and never launched again, and the parent is told the exact command that continues it.
 */
final readonly class RecordAttemptEnded implements Listener
{
    public const string ENDED_REFERENCE = 'launch-ended';

    public function __construct(private HelperStarts $starts) {}

    public function handle(LaunchEnded $event): void
    {
        foreach (JobStopEvidence::openJobs($event->work) as $job) {
            $job->markUnfinished(self::ENDED_REFERENCE);
            HelperNotice::leave($job, sprintf(
                'Helper %s stopped before job %s was finished. Continue it with: %s',
                $job->helper_identity_id,
                $job->id,
                $this->starts->continueCommand($job),
            ));
        }
    }
}
