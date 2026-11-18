<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Http\Requests\Processes\RunChunkRequest;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\Models\ProcessRun;
use Illuminate\Http\JsonResponse;

/**
 * Stores one piece of a part's output sent by the host; a piece already stored is ignored, so a replay adds nothing.
 */
final readonly class RecordRunChunkController
{
    public function __invoke(RunChunkRequest $request, ProcessRun $processRun, OutputRecorder $recorder): JsonResponse
    {
        abort_unless($processRun->acceptsEventKey($request->eventKey()), 403, 'This event key is not the run\'s.');
        $events = new RecordedRunEvents($processRun, $recorder);
        $stored = $events->outputOffset($request->part(), $request->stream());
        if ($request->offset() < $stored) {
            return new JsonResponse(['stored' => $stored]);
        }
        $events->output($request->part(), $request->stream(), $request->bytes());

        return new JsonResponse(['stored' => $request->offset() + strlen($request->bytes())]);
    }
}
