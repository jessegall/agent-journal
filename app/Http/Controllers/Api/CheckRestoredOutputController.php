<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\CheckRestoredOutputPayload;
use App\Api\Processes\RestoreChecked;
use App\Commands\Runs\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Checks a run's restored output and answers each part's state.
 */
final readonly class CheckRestoredOutputController
{
    public function __invoke(CheckRestoredOutputPayload $call, CommandBus $commands): RestoreChecked
    {
        $captures = $commands->run(new VerifyRestoredOutputCommand($call->processRun));

        return RestoreChecked::from([
            'capture' => array_map(
                fn (string $partId, string $state) => [
                    'partId' => $partId,
                    'state' => $state,
                ],
                array_keys($captures),
                array_values($captures),
            ),
        ]);
    }
}
