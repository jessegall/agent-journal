<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Processes\Exceptions\RunnerUnavailable;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\RunnerCapability;
use Illuminate\Http\JsonResponse;

/**
 * Hands an admitted run to the host that runs it, once, with its event key; a second fetch says it already started.
 */
final readonly class FetchAdmissionController
{
    public function __invoke(ProcessRun $processRun, RunnerCapability $runner): JsonResponse
    {
        abort_unless($runner->isOn(), 503, RunnerUnavailable::switchedOff()->getMessage());
        if ($processRun->isStale() && $processRun->consumed_at === null) {
            return new JsonResponse(['message' => $processRun->stale_reason], 409);
        }
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
