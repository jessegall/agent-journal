<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\CheckRestoredOutputCall;
use App\Processes\Calls\RestoreChecked;
use App\Processes\Commands\VerifyRestoredOutput;

/**
 * Checks a run's restored output and answers each part's state.
 */
final readonly class CheckRestoredOutputController
{
    public function __invoke(CheckRestoredOutputCall $call, CommandBus $commands): RestoreChecked
    {
        $captures = $commands->run(new VerifyRestoredOutput($call->processRun));

        return RestoreChecked::from([
            'capture' => array_map(
                fn (string $partId, string $state) => ['partId' => $partId, 'state' => $state],
                array_keys($captures),
                array_values($captures),
            ),
        ]);
    }
}
