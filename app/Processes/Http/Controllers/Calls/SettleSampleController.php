<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\SampleSettled;
use App\Processes\Calls\SettleSampleCall;
use App\Processes\Commands\SettleSample\SettleSampleCommand;

/**
 * Settles a sample and answers where its request stands.
 */
final readonly class SettleSampleController
{
    public function __invoke(SettleSampleCall $call, CommandBus $commands): SampleSettled
    {
        $outcome = $commands->run(new SettleSampleCommand($call->commandRequest));

        return SampleSettled::from([
            'state' => $outcome->state->value,
            'runId' => $outcome->runId,
            'unsampledStatuses' => $outcome->unsampledStatuses,
        ]);
    }
}
