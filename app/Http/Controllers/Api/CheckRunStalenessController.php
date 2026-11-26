<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Runs\ProcessRun;
use App\Processes\Api\CheckRunStalenessPayload;
use App\Processes\Api\RunStaleness;

/**
 * Answers whether a run's rules still hold, to the holder of its event key only.
 */
final readonly class CheckRunStalenessController
{
    public function __invoke(CheckRunStalenessPayload $call, ProcessRun $processRun): RunStaleness
    {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');

        return RunStaleness::from(['staleReason' => $processRun->stale_reason]);
    }
}
