<?php

declare(strict_types=1);

namespace Domain\Helpers\Handlers;

use Domain\Helpers\Commands\FinishHelperJob;
use Domain\Helpers\Handlers\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\JobStopEvidence;

final readonly class FinishHelperJobHandler extends HelperCommandHandler
{
    public function handle(FinishHelperJob $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job) use ($command): void {
            $job->finish($command->reference);
        });
    }
}
