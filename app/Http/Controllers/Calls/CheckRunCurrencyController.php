<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\CheckRunCurrencyCall;
use App\Calls\Processes\RunCurrency;
use App\Models\Runs\ProcessRun;

/**
 * Answers whether a run's rules still hold, to the holder of its event key only.
 */
final readonly class CheckRunCurrencyController
{
    public function __invoke(CheckRunCurrencyCall $call, ProcessRun $processRun): RunCurrency
    {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');

        return RunCurrency::from(['staleReason' => $processRun->stale_reason]);
    }
}
