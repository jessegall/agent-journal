<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Http\Requests\Processes\StartEvidenceRunRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Support\EvidenceRuns;
use Illuminate\Http\JsonResponse;

/**
 * Uses an evidence permit for the calling agent and answers with the evidence run's admission to fetch.
 */
final readonly class StartEvidenceRunController
{
    public function __invoke(
        StartEvidenceRunRequest $request,
        EvidencePermit $evidencePermit,
        CurrentActor $actors,
        EvidenceRuns $evidence,
    ): JsonResponse {
        $run = $evidence->start($evidencePermit, ActorIdentity::of($actors->actor()), $request->requestId());

        return new JsonResponse(['run_id' => $run->id]);
    }
}
