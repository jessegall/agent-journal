<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ApproveSampleCall;
use App\Processes\Calls\SampleApproved;
use App\Processes\Commands\ApproveSample;

/**
 * Approves a sample and answers its permit.
 */
final readonly class ApproveSampleController
{
    public function __invoke(ApproveSampleCall $call, CommandBus $commands): SampleApproved
    {
        $command = new ApproveSample($call->commandRequest, $call->expectedRevision, $call->commandDigest);

        return SampleApproved::from(['permitId' => $commands->run($command)]);
    }
}
