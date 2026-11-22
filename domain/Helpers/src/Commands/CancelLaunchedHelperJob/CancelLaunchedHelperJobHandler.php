<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\CancelLaunchedHelperJob;

use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\JobStopEvidence;

final readonly class CancelLaunchedHelperJobHandler extends HelperCommandHandler
{
    public function handle(CancelLaunchedHelperJobCommand $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job): void {
            $job->cancel();
        });
    }
}
