<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\CancelStartedHelperJob;

use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\JobStopEvidence;

final readonly class CancelStartedHelperJobHandler extends HelperCommandHandler
{
    public function handle(CancelStartedHelperJobCommand $command): void
    {
        JobStopEvidence::openJob($command->jobId)->forAll(function (HelperJob $job): void {
            $job->cancel();
        });
    }
}
