<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Processes\Models\ProcessRun;
use Illuminate\Http\JsonResponse;

/**
 * Hands an admitted run to the host that runs it, once, with its event key; a second fetch says it already started.
 */
final readonly class FetchAdmissionController
{
    public function __invoke(ProcessRun $processRun): JsonResponse
    {
        $eventKey = $processRun->consumeWithEventKey();
        if ($eventKey === '') {
            return new JsonResponse(['run_id' => $processRun->id, 'already_started' => true]);
        }

        return new JsonResponse([
            'run_id' => $processRun->id,
            'already_started' => false,
            'event_key' => $eventKey,
            'dialect' => $processRun->dialect->value,
            'working_folder' => $processRun->working_folder,
            'tree_digest' => $processRun->tree_digest,
            'plan' => $processRun->plan,
        ]);
    }
}
