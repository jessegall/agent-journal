<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\SampleStarted;
use App\Api\Processes\StartSamplePayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Starts a sample run and answers its run.
 */
final readonly class StartSampleController
{
    #[Dispatches(StartSampleCommand::class)]
    public function __invoke(StartSamplePayload $call, CommandBus $commands): SampleStarted
    {
        $runId = $commands->run(new StartSampleCommand($call->commandRequest, $call->permit, $call->requestKey->value));

        return SampleStarted::from(['runId' => $runId]);
    }
}
