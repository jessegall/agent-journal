<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\SampleStarted;
use App\Processes\Calls\StartSampleCall;
use App\Processes\Commands\StartSample\StartSampleCommand;

/**
 * Starts a sample run and answers its run.
 */
final readonly class StartSampleController
{
    public function __invoke(StartSampleCall $call, CommandBus $commands): SampleStarted
    {
        $runId = $commands->run(new StartSampleCommand($call->commandRequest, $call->permit, $call->requestKey->value));

        return SampleStarted::from(['runId' => $runId]);
    }
}
