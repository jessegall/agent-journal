<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\HoldHelperJob;

use App\Contracts\Actors\AgentTexts;
use App\Values\AgentText;
use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Support\JobStopEvidence;

final readonly class HoldHelperJobHandler extends HelperCommandHandler
{
    public function __construct(private AgentTexts $texts) {}

    public function handle(HoldHelperJobCommand $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job) use ($command): void {
            $job->hold($command->reference);

            HelperNotice::create($job, $this->texts->render(AgentText::of('helpers.held', [
                'helper' => $job->helper_identity_id,
                'job' => $job->id,
            ])));
        });
    }
}
