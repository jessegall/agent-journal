<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Http\Requests\Processes\RunCurrencyRequest;
use App\Processes\Models\ProcessRun;
use Illuminate\Http\JsonResponse;

/**
 * Answers a running supervisor whether its next part may start: the stale reason when a rule, binding or policy the
 * run was admitted under changed, or an empty one.
 */
final readonly class RunCurrencyController
{
    public function __invoke(RunCurrencyRequest $request, ProcessRun $processRun): JsonResponse
    {
        abort_unless($processRun->acceptsEventKey($request->eventKey()), 403, 'This event key is not the run\'s.');

        return new JsonResponse(['stale_reason' => $processRun->stale_reason]);
    }
}
