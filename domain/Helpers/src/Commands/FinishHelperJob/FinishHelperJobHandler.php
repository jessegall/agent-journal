<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\FinishHelperJob;

use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\JobStopEvidence;

final readonly class FinishHelperJobHandler extends HelperCommandHandler
{
    public function handle(FinishHelperJobCommand $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job) use ($command): void {
            $job->finish($command->reference);
        });
    }
}
