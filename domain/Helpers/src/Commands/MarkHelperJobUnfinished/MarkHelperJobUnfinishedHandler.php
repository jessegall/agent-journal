<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\MarkHelperJobUnfinished;

use App\Actors\Contracts\AgentTexts;
use App\Values\AgentText;
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
    public const string ENDED_REFERENCE = 'start-ended';

    public function __construct(private HelperStarts $starts, private AgentTexts $texts) {}

    public function handle(MarkHelperJobUnfinishedCommand $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job): void {
            $job->markUnfinished(self::ENDED_REFERENCE);

            HelperNotice::create($job, $this->texts->render(AgentText::of('helpers.unfinished', [
                'helper' => $job->helper_identity_id,
                'job' => $job->id,
                'command' => $this->starts->continueCall($job),
            ])));
        });
    }
}
