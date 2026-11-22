<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\MarkHelperJobUnfinished;

use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Support\HelperStarts;
use Domain\Helpers\Support\JobStopEvidence;

final readonly class MarkHelperJobUnfinishedHandler extends HelperCommandHandler
{
    /**
     * The stop evidence of a job whose helper stopped before it was finished.
     */
    public const string ENDED_REFERENCE = 'launch-ended';

    public function __construct(private HelperStarts $starts) {}

    public function handle(MarkHelperJobUnfinishedCommand $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job): void {
            $job->markUnfinished(self::ENDED_REFERENCE);

            HelperNotice::create($job, sprintf(
                'Helper %s stopped before job %s was finished. Continue it with: %s',
                $job->helper_identity_id,
                $job->id,
                $this->starts->continueCommand($job),
            ));
        });
    }
}
