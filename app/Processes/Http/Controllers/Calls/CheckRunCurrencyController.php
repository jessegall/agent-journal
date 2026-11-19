<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Processes\Calls\CheckRunCurrencyCall;
use App\Processes\Calls\RunCurrency;
use App\Processes\Models\ProcessRun;

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
