<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ApproveSampleCall;
use App\Calls\Processes\SampleApproved;
use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Approves a sample and answers its permit.
 */
final readonly class ApproveSampleController
{
    public function __invoke(ApproveSampleCall $call, CommandBus $commands): SampleApproved
    {
        $command = new ApproveSampleCommand($call->commandRequest, $call->expectedRevision, $call->commandDigest);

        return SampleApproved::from(['permitId' => $commands->run($command)]);
    }
}
