<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\SettleSample\SettleSampleCommand;
use App\Processes\Api\SampleSettled;
use App\Processes\Api\SettleSamplePayload;

/**
 * Settles a sample and answers where its request stands.
 */
final readonly class SettleSampleController
{
    #[Dispatches(SettleSampleCommand::class)]
    public function __invoke(SettleSamplePayload $call, CommandBus $commands): SampleSettled
    {
        $outcome = $commands->run(new SettleSampleCommand($call->commandRequest));

        return SampleSettled::from([
            'state' => $outcome->status->value,
            'runId' => $outcome->runId,
            'unsampledStatuses' => $outcome->unsampledStatuses,
        ]);
    }
}
