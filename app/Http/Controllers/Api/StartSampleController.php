<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\StartSample\StartSampleCommand;
use App\Processes\Api\SampleStarted;
use App\Processes\Api\StartSamplePayload;

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
