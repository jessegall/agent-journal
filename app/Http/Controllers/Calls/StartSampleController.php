<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\SampleStarted;
use App\Calls\Processes\StartSampleCall;
use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Contracts\Bus\CommandBus;

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
