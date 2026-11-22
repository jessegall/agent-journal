<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\CheckRestoredOutputCall;
use App\Calls\Processes\RestoreChecked;
use App\Commands\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Checks a run's restored output and answers each part's state.
 */
final readonly class CheckRestoredOutputController
{
    public function __invoke(CheckRestoredOutputCall $call, CommandBus $commands): RestoreChecked
    {
        $captures = $commands->run(new VerifyRestoredOutputCommand($call->processRun));

        return RestoreChecked::from([
            'capture' => array_map(
                fn (string $partId, string $state) => ['partId' => $partId, 'state' => $state],
                array_keys($captures),
                array_values($captures),
            ),
        ]);
    }
}
