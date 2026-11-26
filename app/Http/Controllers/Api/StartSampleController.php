<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\SampleStarted;
use App\Api\Processes\StartSamplePayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\StartSample\StartSampleCommand;

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
