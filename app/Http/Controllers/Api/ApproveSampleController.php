<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ApproveSamplePayload;
use App\Api\Processes\SampleApproved;
use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Approves a sample and answers its permit.
 */
final readonly class ApproveSampleController
{
    public function __invoke(ApproveSamplePayload $call, CommandBus $commands): SampleApproved
    {
        $command = new ApproveSampleCommand($call->commandRequest, $call->expectedRevision, $call->commandDigest);

        return SampleApproved::from(['permitId' => $commands->run($command)]);
    }
}
