<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\SampleSettled;
use App\Calls\Processes\SettleSampleCall;
use App\Commands\SettleSample\SettleSampleCommand;
use App\Contracts\Bus\CommandBus;

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
